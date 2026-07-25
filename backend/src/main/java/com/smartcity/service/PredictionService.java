package com.smartcity.service;

import com.smartcity.dto.ProjectRequest;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.Alert;
import com.smartcity.entity.Prediction;
import com.smartcity.entity.Project;
import com.smartcity.ml.MlServiceClient;
import com.smartcity.repository.AlertRepository;
import com.smartcity.repository.PredictionRepository;
import com.smartcity.repository.ProjectRepository;
import com.smartcity.util.ProjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
public class PredictionService {

    private final ProjectRepository projectRepository;
    private final PredictionRepository predictionRepository;
    private final MlServiceClient mlServiceClient;
    private final AlertRepository alertRepository;
    private final EmailService emailService;

    public PredictionService(ProjectRepository projectRepository,
                              PredictionRepository predictionRepository,
                              MlServiceClient mlServiceClient,
                              AlertRepository alertRepository,
                              EmailService emailService) {
        this.projectRepository = projectRepository;
        this.predictionRepository = predictionRepository;
        this.mlServiceClient = mlServiceClient;
        this.alertRepository = alertRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ProjectResponse predict(ProjectRequest req) {
        Project project = projectRepository.save(Objects.requireNonNull(ProjectMapper.toEntity(req), "Project payload must not be null"));

        MlServiceClient.ConflictResult conflictResult = mlServiceClient.predictConflict(req);
        MlServiceClient.PriorityResult priorityResult = mlServiceClient.predictPriority(req);

        Prediction prediction = new Prediction();
        prediction.setProject(project);
        prediction.setConflictPrediction(conflictResult.getConflictPrediction());
        prediction.setConflictProbability(conflictResult.getConflictProbability());
        prediction.setPriorityPrediction(priorityResult.getPriorityPrediction());

        Prediction saved = predictionRepository.save(prediction);
        project.setPrediction(saved);

        if ("Conflict".equalsIgnoreCase(conflictResult.getConflictPrediction()) || (conflictResult.getConflictProbability() != null && conflictResult.getConflictProbability() >= 0.5)) {
            Alert alert = new Alert();
            alert.setType("warning");
            alert.setTitle("AI Conflict Alert: " + project.getZone() + " (" + project.getDepartment() + ")");
            int probPct = conflictResult.getConflictProbability() != null ? (int) Math.round(conflictResult.getConflictProbability() * 100) : 50;
            alert.setDescription("AI Engine detected a " + probPct + "% conflict risk for '" + project.getProjectName() + "' in " + project.getZone() + ".");
            alert.setActive(true);
            alertRepository.save(alert);

            // Dispatch SMTP Email Notification asynchronously
            emailService.sendAlertNotification(
                "vbsattanathan@gmail.com",
                alert.getTitle(),
                alert.getTitle(),
                alert.getDescription()
            );
        } else if ("High".equalsIgnoreCase(priorityResult.getPriorityPrediction())) {
            Alert alert = new Alert();
            alert.setType("info");
            alert.setTitle("High Priority AI Prediction: " + project.getProjectName());
            alert.setDescription("Project '" + project.getProjectName() + "' classified as HIGH Priority by AI model.");
            alert.setActive(true);
            alertRepository.save(alert);

            // Dispatch SMTP Email Notification asynchronously
            emailService.sendAlertNotification(
                "admin@smartcity.gov.in",
                alert.getTitle(),
                alert.getTitle(),
                alert.getDescription()
            );
        }

        return ProjectMapper.toResponse(project);
    }
}
