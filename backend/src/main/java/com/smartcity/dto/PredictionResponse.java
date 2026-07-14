package com.smartcity.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PredictionResponse {
    private Long id;
    private Long projectId;
    private Double conflictProbability;
    private String conflictPrediction;
    private String priorityPrediction;
    private LocalDateTime predictionTime;
}
