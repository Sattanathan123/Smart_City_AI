package com.smartcity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProjectRequest {

    @NotBlank
    private String projectName;

    private String department;
    private String projectType;
    private String zone;

    @NotNull
    private Double budgetLakhs;

    @NotNull
    private Integer durationDays;

    private Integer trafficDensity;
    private Integer weatherRisk;
    private Integer utilityDependency;
    private Integer populationDensity;
    private Integer criticalInfrastructure;
    private Integer citizenImpact;
    private Integer resourceRequirement;
    private Integer contractorAvailability;

    private String status = "PENDING";
}
