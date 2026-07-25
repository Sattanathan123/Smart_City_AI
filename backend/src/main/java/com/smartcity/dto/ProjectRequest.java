package com.smartcity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

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

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public Double getBudgetLakhs() { return budgetLakhs; }
    public void setBudgetLakhs(Double budgetLakhs) { this.budgetLakhs = budgetLakhs; }

    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }

    public Integer getTrafficDensity() { return trafficDensity; }
    public void setTrafficDensity(Integer trafficDensity) { this.trafficDensity = trafficDensity; }

    public Integer getWeatherRisk() { return weatherRisk; }
    public void setWeatherRisk(Integer weatherRisk) { this.weatherRisk = weatherRisk; }

    public Integer getUtilityDependency() { return utilityDependency; }
    public void setUtilityDependency(Integer utilityDependency) { this.utilityDependency = utilityDependency; }

    public Integer getPopulationDensity() { return populationDensity; }
    public void setPopulationDensity(Integer populationDensity) { this.populationDensity = populationDensity; }

    public Integer getCriticalInfrastructure() { return criticalInfrastructure; }
    public void setCriticalInfrastructure(Integer criticalInfrastructure) { this.criticalInfrastructure = criticalInfrastructure; }

    public Integer getCitizenImpact() { return citizenImpact; }
    public void setCitizenImpact(Integer citizenImpact) { this.citizenImpact = citizenImpact; }

    public Integer getResourceRequirement() { return resourceRequirement; }
    public void setResourceRequirement(Integer resourceRequirement) { this.resourceRequirement = resourceRequirement; }

    public Integer getContractorAvailability() { return contractorAvailability; }
    public void setContractorAvailability(Integer contractorAvailability) { this.contractorAvailability = contractorAvailability; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
