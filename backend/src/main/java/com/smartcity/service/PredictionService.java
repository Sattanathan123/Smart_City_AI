package com.smartcity.service;

import com.smartcity.dto.ProjectRequest;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.Prediction;
import com.smartcity.entity.Project;
import com.smartcity.ml.MlServiceClient;
import com.smartcity.repository.PredictionRepository;
import com.smartcity.repository.ProjectRepository;
import com.smartcity.util.ProjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PredictionService {

    private final ProjectRepository projectRepository;
    private final PredictionRepository predictionRepository;
    private final MlServiceClient mlServiceClient;

    public PredictionService(ProjectRepository projectRepository,
                             PredictionRepository predictionRepository,
                             MlServiceClient mlServiceClient) {
        this.projectRepository = projectRepository;
        this.predictionRepository = predictionRepository;
        this.mlServiceClient = mlServiceClient;
    }

    @Transactional
    public ProjectResponse predict(ProjectRequest req) {
        Project project = projectRepository.save(ProjectMapper.toEntity(req));

        MlServiceClient.ConflictResult conflictResult = mlServiceClient.predictConflict(req);
        MlServiceClient.PriorityResult priorityResult = mlServiceClient.predictPriority(req);

        Prediction prediction = new Prediction();
        prediction.setProject(project);
        prediction.setConflictPrediction(conflictResult.getConflictPrediction());
        prediction.setConflictProbability(conflictResult.getConflictProbability());
        prediction.setPriorityPrediction(priorityResult.getPriorityPrediction());

        Prediction saved = predictionRepository.save(prediction);
        project.setPrediction(saved);

        return ProjectMapper.toResponse(project);
    }
}
