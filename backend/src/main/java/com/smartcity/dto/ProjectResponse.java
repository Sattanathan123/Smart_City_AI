package com.smartcity.dto;

import java.time.LocalDateTime;

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public String getSanctionedBy() { return sanctionedBy; }
    public void setSanctionedBy(String sanctionedBy) { this.sanctionedBy = sanctionedBy; }
    public String getSanctionRemark() { return sanctionRemark; }
    public void setSanctionRemark(String sanctionRemark) { this.sanctionRemark = sanctionRemark; }
    public PredictionResponse getPrediction() { return prediction; }
    public void setPrediction(PredictionResponse prediction) { this.prediction = prediction; }
}
