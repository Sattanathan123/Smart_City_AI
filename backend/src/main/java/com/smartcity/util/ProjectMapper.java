package com.smartcity.util;

import com.smartcity.dto.PredictionResponse;
import com.smartcity.dto.ProjectRequest;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.Prediction;
import com.smartcity.entity.Project;

public class ProjectMapper {

    public static Project toEntity(ProjectRequest req) {
        Project p = new Project();
        p.setProjectName(req.getProjectName());
        p.setDepartment(req.getDepartment());
        p.setProjectType(req.getProjectType());
        p.setZone(req.getZone());
        p.setBudgetLakhs(req.getBudgetLakhs());
        p.setDurationDays(req.getDurationDays());
        p.setTrafficDensity(req.getTrafficDensity());
        p.setWeatherRisk(req.getWeatherRisk());
        p.setUtilityDependency(req.getUtilityDependency());
        p.setPopulationDensity(req.getPopulationDensity());
        p.setCriticalInfrastructure(req.getCriticalInfrastructure());
        p.setCitizenImpact(req.getCitizenImpact());
        p.setResourceRequirement(req.getResourceRequirement());
        p.setContractorAvailability(req.getContractorAvailability());
        p.setStatus(req.getStatus() != null ? req.getStatus() : "PENDING");
        return p;
    }

    public static ProjectResponse toResponse(Project p) {
        ProjectResponse res = new ProjectResponse();
        res.setId(p.getId());
        res.setProjectName(p.getProjectName());
        res.setDepartment(p.getDepartment());
        res.setProjectType(p.getProjectType());
        res.setZone(p.getZone());
        res.setBudgetLakhs(p.getBudgetLakhs());
        res.setDurationDays(p.getDurationDays());
        res.setTrafficDensity(p.getTrafficDensity());
        res.setWeatherRisk(p.getWeatherRisk());
        res.setUtilityDependency(p.getUtilityDependency());
        res.setPopulationDensity(p.getPopulationDensity());
        res.setCriticalInfrastructure(p.getCriticalInfrastructure());
        res.setCitizenImpact(p.getCitizenImpact());
        res.setResourceRequirement(p.getResourceRequirement());
        res.setContractorAvailability(p.getContractorAvailability());
        res.setStatus(p.getStatus());
        res.setCreatedAt(p.getCreatedAt());
        res.setCreatedBy(p.getCreatedBy());
        res.setSanctionedBy(p.getSanctionedBy());
        res.setSanctionRemark(p.getSanctionRemark());
        if (p.getPrediction() != null) {
            res.setPrediction(toPredictionResponse(p.getPrediction()));
        }
        return res;
    }

    public static PredictionResponse toPredictionResponse(Prediction pred) {
        PredictionResponse res = new PredictionResponse();
        res.setId(pred.getId());
        res.setProjectId(pred.getProject().getId());
        res.setConflictProbability(pred.getConflictProbability());
        res.setConflictPrediction(pred.getConflictPrediction());
        res.setPriorityPrediction(pred.getPriorityPrediction());
        res.setPredictionTime(pred.getPredictionTime());
        return res;
    }
}
