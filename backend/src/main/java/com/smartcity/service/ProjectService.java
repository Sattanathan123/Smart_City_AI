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

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MlServiceClient mlServiceClient;
    private final AlertRepository alertRepository;
    private final EmailService emailService;

    public ProjectService(ProjectRepository projectRepository,
                          MlServiceClient mlServiceClient,
                          AlertRepository alertRepository,
                          EmailService emailService) {
        this.projectRepository = projectRepository;
        this.mlServiceClient = mlServiceClient;
        this.alertRepository = alertRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ProjectResponse create(ProjectRequest req, User currentUser) {
        Project p = ProjectMapper.toEntity(req);
        p.setStatus("DRAFT");
        p.setCreatedBy(currentUser.getEmail());
        // Officer can only create for their own department
        if (currentUser.getRole() == Role.DEPARTMENT_OFFICER) {
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
        if (currentUser.getRole() == Role.ADMIN) {
            return projectRepository.findAll().stream().map(ProjectMapper::toResponse).toList();
        }
        // Officer sees only their department
        return projectRepository.findByDepartmentOrderByCreatedAtDesc(currentUser.getDepartment())
                .stream().map(ProjectMapper::toResponse).toList();
    }

    public ProjectResponse getById(Long id) {
        return ProjectMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest req, User currentUser) {
        Project existing = findOrThrow(id);
        // Officer can only update their own department projects
        if (currentUser.getRole() == Role.DEPARTMENT_OFFICER
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
        String newStatus = "APPROVE".equalsIgnoreCase(action) ? "ACTIVE" : "REJECTED";
        p.setStatus(newStatus);
        p.setSanctionedBy(sanctionedBy);
        p.setSanctionRemark(remark);
        Project saved = projectRepository.save(p);

        emailService.sendAlertNotification(
            "vbsattanathan@gmail.com",
            "Project Decision Update: " + saved.getProjectName(),
            "Project Status Changed to " + newStatus,
            "Project '" + saved.getProjectName() + "' (" + saved.getZone() + ") has been " + newStatus + " by " + sanctionedBy + ". Remark: " + (remark != null ? remark : "N/A")
        );

        return ProjectMapper.toResponse(saved);
    }

    public Project findOrThrow(Long id) {
        return projectRepository.findById(java.util.Objects.requireNonNull(id, "Project id must not be null"))
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }
}
