package com.smartcity.util;

import com.smartcity.dto.PredictionResponse;
import com.smartcity.dto.ProjectRequest;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.Prediction;
import com.smartcity.entity.Project;

import java.util.ArrayList;
import java.util.List;

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
            res.setPrediction(toPredictionResponse(p.getPrediction(), p));
        }
        return res;
    }

    public static PredictionResponse toPredictionResponse(Prediction pred, Project p) {
        PredictionResponse res = new PredictionResponse();
        res.setId(pred.getId());
        if (pred.getProject() != null) {
            res.setProjectId(pred.getProject().getId());
        }
        res.setConflictProbability(pred.getConflictProbability());
        res.setConflictPrediction(pred.getConflictPrediction());
        res.setPriorityPrediction(pred.getPriorityPrediction());
        res.setPredictionTime(pred.getPredictionTime());

        // Generate Explainable AI (XAI) Reasons & Recommendations
        List<String> explanations = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        if ("Conflict".equalsIgnoreCase(pred.getConflictPrediction()) || (pred.getConflictProbability() != null && pred.getConflictProbability() >= 0.5)) {
            explanations.add("Spatial Overlap in " + (p != null ? p.getZone() : "Sector Area"));
            explanations.add("Timeline & Schedule Overlap during peak construction window");
            explanations.add("High Utility & Infrastructure Dependency Index");
            explanations.add("Inter-departmental resource bottleneck");

            recommendations.add("Reschedule Project start timeline by 5-10 Days");
            recommendations.add("Merge execution with existing Road/Utility trenching");
            recommendations.add("Allocate alternate contractor workforce team");
            recommendations.add("Notify & hold joint inter-departmental review");
        } else {
            explanations.add("Clear spatial corridor with zero overlapping utility works");
            explanations.add("Independent resource allocation schedule");
            explanations.add("Low environmental & weather risk footprint");

            recommendations.add("Proceed with standard scheduling approval");
            recommendations.add("Routine monitoring during active phase");
        }

        if ("High".equalsIgnoreCase(pred.getPriorityPrediction())) {
            explanations.add("High Population Density zone");
            explanations.add("High Citizen Impact Rating");
            explanations.add("Critical Public Service infrastructure dependency");

            recommendations.add("Fast-track administrative approval");
            recommendations.add("Allocate priority workforce & heavy machinery");
        }

        res.setExplanations(explanations);
        res.setRecommendations(recommendations);
        return res;
    }

    public static PredictionResponse toPredictionResponse(Prediction pred) {
        return toPredictionResponse(pred, pred.getProject());
    }
}
