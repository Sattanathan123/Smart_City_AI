package com.smartcity.service;

import com.smartcity.dto.ProjectRequest;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.Alert;
import com.smartcity.entity.Prediction;
import com.smartcity.entity.Project;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.ml.MlServiceClient;
import com.smartcity.repository.AlertRepository;
import com.smartcity.repository.ProjectRepository;
import com.smartcity.util.ProjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import com.smartcity.entity.ProjectWeatherRisk;
import com.smartcity.repository.ProjectWeatherRiskRepository;
import com.smartcity.service.NotificationService;
import com.smartcity.service.WeatherService;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MlServiceClient mlServiceClient;
    private final AlertRepository alertRepository;
    private final EmailService emailService;
    private final WeatherService weatherService;
    private final ProjectWeatherRiskRepository weatherRiskRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public ProjectService(ProjectRepository projectRepository,
                          MlServiceClient mlServiceClient,
                          AlertRepository alertRepository,
                          EmailService emailService,
                          WeatherService weatherService,
                          ProjectWeatherRiskRepository weatherRiskRepository,
                          NotificationService notificationService,
                          AuditLogService auditLogService) {
        this.projectRepository = projectRepository;
        this.mlServiceClient = mlServiceClient;
        this.alertRepository = alertRepository;
        this.emailService = emailService;
        this.weatherService = weatherService;
        this.weatherRiskRepository = weatherRiskRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    private void evaluateAndSaveWeatherRisk(Project p) {
        try {
            Map<String, Object> forecast = weatherService.getWeatherForZone(p.getZone());
            Map<String, Object> mlResult = mlServiceClient.predictWeatherRisk(p.getProjectType(), p.getZone(), forecast);

            ProjectWeatherRisk risk = new ProjectWeatherRisk();
            risk.setProjectId(p.getId());
            risk.setWorkabilityScore((Integer) mlResult.getOrDefault("workabilityScore", 75));
            risk.setRiskLevel((String) mlResult.getOrDefault("riskLevel", "LOW"));
            risk.setRecommendedAction((String) mlResult.getOrDefault("recommendedAction", "CONTINUE"));
            risk.setDelayHours((Integer) mlResult.getOrDefault("delayHours", 0));
            risk.setWeatherSummary((String) mlResult.getOrDefault("weatherSummary", "Clear"));

            Object reasonsObj = mlResult.get("reason");
            if (reasonsObj instanceof List) {
                risk.setRiskReasons(String.join("; ", (List<String>) reasonsObj));
            } else {
                risk.setRiskReasons(String.valueOf(reasonsObj));
            }

            weatherRiskRepository.save(risk);

            // Send real-time WebSocket alert if weather risk is high or project requires delay/stop/prioritization
            if ("HIGH".equals(risk.getRiskLevel()) || "CRITICAL".equals(risk.getRiskLevel()) || !"CONTINUE".equals(risk.getRecommendedAction())) {
                String title = "Weather Risk Alert: " + p.getProjectName();
                String msg = "Weather risk level " + risk.getRiskLevel() + " in " + p.getZone() + ". Recommendation: " + risk.getRecommendedAction() + " (" + risk.getDelayHours() + "h delay). Reasons: " + risk.getRiskReasons();
                notificationService.sendNotification("ALL", null, title, msg, "WEATHER_ALERT");
            }
        } catch (Exception ignored) {}
    }

    @Transactional
    public ProjectResponse create(ProjectRequest req, User currentUser) {
        Project p = ProjectMapper.toEntity(req);
        p.setStatus("DRAFT");
        p.setCreatedBy(currentUser != null ? currentUser.getEmail() : "SYSTEM");
        // Officer can only create for their own department
        if (currentUser != null && currentUser.getRole() == Role.DEPARTMENT_OFFICER && currentUser.getDepartment() != null) {
            p.setDepartment(currentUser.getDepartment());
        }

        // Save initial project
        Project saved = projectRepository.save(p);

        // Run dynamic AI detection & attach prediction
        Prediction prediction = generatePrediction(saved, req);
        saved.setPrediction(prediction);

        return ProjectMapper.toResponse(projectRepository.save(saved));
    }

    public List<ProjectResponse> getAll(User currentUser) {
        if (currentUser != null && currentUser.getRole() == Role.DEPARTMENT_OFFICER && currentUser.getDepartment() != null) {
            return projectRepository.findByDepartmentOrderByCreatedAtDesc(currentUser.getDepartment())
                    .stream().map(ProjectMapper::toResponse).toList();
        }
        return projectRepository.findAll().stream().map(ProjectMapper::toResponse).toList();
    }

    public ProjectResponse getById(Long id) {
        return ProjectMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest req, User currentUser) {
        Project existing = findOrThrow(id);
        // Officer can only update their own department projects
        if (currentUser != null && currentUser.getRole() == Role.DEPARTMENT_OFFICER
                && currentUser.getDepartment() != null
                && !existing.getDepartment().equals(currentUser.getDepartment())) {
            throw new BadRequestException("You can only update projects in your department");
        }
        Project updated = ProjectMapper.toEntity(req);
        updated.setId(existing.getId());
        updated.setCreatedAt(existing.getCreatedAt());
        updated.setCreatedBy(existing.getCreatedBy());
        updated.setSanctionedBy(existing.getSanctionedBy());
        updated.setSanctionRemark(existing.getSanctionRemark());

        // Re-run dynamic AI detection on updated parameters
        Prediction prediction = existing.getPrediction();
        if (prediction == null) {
            prediction = new Prediction();
            prediction.setProject(updated);
        }
        MlServiceClient.ConflictResult conflict = mlServiceClient.predictConflict(req);
        MlServiceClient.PriorityResult priority = mlServiceClient.predictPriority(req);

        prediction.setConflictPrediction(conflict.getConflictPrediction());
        prediction.setConflictProbability(conflict.getConflictProbability());
        prediction.setPriorityPrediction(priority.getPriorityPrediction());
        updated.setPrediction(prediction);

        checkAndTriggerAlert(updated, conflict, priority);

        return ProjectMapper.toResponse(projectRepository.save(updated));
    }

    private Prediction generatePrediction(Project project, ProjectRequest req) {
        MlServiceClient.ConflictResult conflict = mlServiceClient.predictConflict(req);
        MlServiceClient.PriorityResult priority = mlServiceClient.predictPriority(req);

        Prediction prediction = new Prediction();
        prediction.setProject(project);
        prediction.setConflictPrediction(conflict.getConflictPrediction());
        prediction.setConflictProbability(conflict.getConflictProbability());
        prediction.setPriorityPrediction(priority.getPriorityPrediction());

        checkAndTriggerAlert(project, conflict, priority);
        evaluateAndSaveWeatherRisk(project);

        return prediction;
    }

    private void checkAndTriggerAlert(Project project, MlServiceClient.ConflictResult conflict, MlServiceClient.PriorityResult priority) {
        if (alertRepository == null) return;
        if ("Conflict".equalsIgnoreCase(conflict.getConflictPrediction()) || (conflict.getConflictProbability() != null && conflict.getConflictProbability() >= 0.5)) {
            Alert alert = new Alert();
            alert.setType("warning");
            alert.setTitle("AI Conflict Warning: " + project.getZone() + " (" + project.getDepartment() + ")");
            int probPct = conflict.getConflictProbability() != null ? (int) Math.round(conflict.getConflictProbability() * 100) : 50;
            alert.setDescription("Project '" + project.getProjectName() + "' has a " + probPct + "% AI predicted risk of spatial/resource overlap in " + project.getZone() + ".");
            alert.setActive(true);
            alertRepository.save(alert);

            emailService.sendAlertNotification(
                "vbsattanathan@gmail.com",
                alert.getTitle(),
                alert.getTitle(),
                alert.getDescription()
            );
        } else if ("High".equalsIgnoreCase(priority.getPriorityPrediction())) {
            Alert alert = new Alert();
            alert.setType("info");
            alert.setTitle("High Priority Project Registered: " + project.getProjectName());
            alert.setDescription("AI Engine classified '" + project.getProjectName() + "' in " + project.getZone() + " as HIGH Priority for immediate review.");
            alert.setActive(true);
            alertRepository.save(alert);

            emailService.sendAlertNotification(
                "vbsattanathan@gmail.com",
                alert.getTitle(),
                alert.getTitle(),
                alert.getDescription()
            );
        }
    }

    public void delete(Long id) {
        Project project = findOrThrow(id);
        projectRepository.delete(project);
    }

    public List<ProjectResponse> getByStatus(String status) {
        return projectRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream().map(ProjectMapper::toResponse).toList();
    }

    public ProjectResponse sanction(Long id, String action, String sanctionedBy, String remark) {
        Project p = findOrThrow(id);
        String actUpper = action != null ? action.toUpperCase() : "APPROVE";
        String newStatus;
        switch (actUpper) {
            case "APPROVE":
            case "APPROVED":
                newStatus = "APPROVED";
                break;
            case "REJECT":
            case "REJECTED":
                newStatus = "REJECTED";
                break;
            case "REQUEST_MODIFICATION":
            case "MODIFICATION":
            case "MODIFICATION_REQUESTED":
                newStatus = "MODIFICATION_REQUESTED";
                break;
            case "HOLD":
            case "ON_HOLD":
                newStatus = "ON_HOLD";
                break;
            case "RESUME":
            case "ACTIVE":
                newStatus = "ACTIVE";
                break;
            case "CANCEL":
            case "CANCELLED":
                newStatus = "CANCELLED";
                break;
            case "COMPLETED":
                newStatus = "COMPLETED";
                break;
            default:
                newStatus = actUpper;
                break;
        }
        p.setStatus(newStatus);
        p.setSanctionedBy(sanctionedBy);
        p.setSanctionRemark(remark);
        Project saved = projectRepository.save(p);

        try {
            auditLogService.logAction(
                sanctionedBy != null ? sanctionedBy : "admin@smartcity.gov.in",
                "ADMIN",
                "PROJECT_GOVERNANCE_ACTION",
                "Project #" + saved.getId() + " ('" + saved.getProjectName() + "') transitioned to " + newStatus + ". Action: " + actUpper + ". Remark: " + (remark != null ? remark : "N/A"),
                "127.0.0.1"
            );
        } catch (Exception ignored) {}

        emailService.sendAlertNotification(
            "vbsattanathan@gmail.com",
            "Project Decision Update: " + saved.getProjectName(),
            "Project Status Changed to " + newStatus,
            "Project '" + saved.getProjectName() + "' (" + saved.getZone() + ") has been " + newStatus + " by " + sanctionedBy + ". Remark: " + (remark != null ? remark : "N/A")
        );

        notificationService.sendNotification(
            "OFFICER",
            null,
            "Project " + newStatus + ": " + saved.getProjectName(),
            "Project '" + saved.getProjectName() + "' in " + saved.getZone() + " status updated to " + newStatus + " by Admin (" + (sanctionedBy != null ? sanctionedBy : "Admin") + "). Remark: " + (remark != null ? remark : "None"),
            "PROJECT"
        );

        return ProjectMapper.toResponse(saved);
    }

    public Project findOrThrow(Long id) {
        return projectRepository.findById(java.util.Objects.requireNonNull(id, "Project id must not be null"))
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }
}
