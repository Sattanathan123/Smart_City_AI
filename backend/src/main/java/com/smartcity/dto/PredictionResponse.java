package com.smartcity.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PredictionResponse {
    private Long id;
    private Long projectId;
    private Double conflictProbability;
    private String conflictPrediction;
    private String priorityPrediction;
    private List<String> explanations;
    private List<String> recommendations;
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
    public List<String> getExplanations() { return explanations; }
    public void setExplanations(List<String> explanations) { this.explanations = explanations; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public LocalDateTime getPredictionTime() { return predictionTime; }
    public void setPredictionTime(LocalDateTime predictionTime) { this.predictionTime = predictionTime; }
}
