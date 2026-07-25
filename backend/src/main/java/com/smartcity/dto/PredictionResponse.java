package com.smartcity.dto;

import java.time.LocalDateTime;

public class PredictionResponse {
    private Long id;
    private Long projectId;
    private Double conflictProbability;
    private String conflictPrediction;
    private String priorityPrediction;
    private LocalDateTime predictionTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public Double getConflictProbability() { return conflictProbability; }
    public void setConflictProbability(Double conflictProbability) { this.conflictProbability = conflictProbability; }
    public String getConflictPrediction() { return conflictPrediction; }
    public void setConflictPrediction(String conflictPrediction) { this.conflictPrediction = conflictPrediction; }
    public String getPriorityPrediction() { return priorityPrediction; }
    public void setPriorityPrediction(String priorityPrediction) { this.priorityPrediction = priorityPrediction; }
    public LocalDateTime getPredictionTime() { return predictionTime; }
    public void setPredictionTime(LocalDateTime predictionTime) { this.predictionTime = predictionTime; }
}
