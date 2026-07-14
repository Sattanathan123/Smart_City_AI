package com.smartcity.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectResponse {
    private Long id;
    private String projectName;
    private String department;
    private String projectType;
    private String zone;
    private Double budgetLakhs;
    private Integer durationDays;
    private Integer trafficDensity;
    private Integer weatherRisk;
    private Integer utilityDependency;
    private Integer populationDensity;
    private Integer criticalInfrastructure;
    private Integer citizenImpact;
    private Integer resourceRequirement;
    private Integer contractorAvailability;
    private String status;
    private LocalDateTime createdAt;
    private String createdBy;
    private String sanctionedBy;
    private String sanctionRemark;
    private PredictionResponse prediction;
}
