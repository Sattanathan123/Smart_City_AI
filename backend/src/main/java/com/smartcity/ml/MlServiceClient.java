package com.smartcity.ml;

import com.smartcity.dto.ProjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Component
public class MlServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public MlServiceClient(RestTemplate restTemplate,
                           @Value("${ml.service.base-url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public ConflictResult predictConflict(ProjectRequest request) {
        try {
            ConflictResult res = restTemplate.postForObject(baseUrl + "/predict/conflict", request, ConflictResult.class);
            if (res != null && res.getConflictPrediction() != null) {
                return res;
            }
        } catch (Exception ignored) {
            // Fall back to heuristic conflict engine if Python ML service is offline
        }
        return computeFallbackConflict(request);
    }

    public PriorityResult predictPriority(ProjectRequest request) {
        try {
            PriorityResult res = restTemplate.postForObject(baseUrl + "/predict/priority", request, PriorityResult.class);
            if (res != null && res.getPriorityPrediction() != null) {
                return res;
            }
        } catch (Exception ignored) {
            // Fall back to heuristic priority engine if Python ML service is offline
        }
        return computeFallbackPriority(request);
    }

    private ConflictResult computeFallbackConflict(ProjectRequest req) {
        double weather = req.getWeatherRisk() != null ? req.getWeatherRisk() / 10.0 : 0.5;
        int utility = req.getUtilityDependency() != null ? req.getUtilityDependency() : 5;
        int contractor = req.getContractorAvailability() != null ? req.getContractorAvailability() : 5;
        int resource = req.getResourceRequirement() != null ? req.getResourceRequirement() : 5;

        double score = 0.18 + (weather * 0.25) + (utility * 0.05) + (contractor * 0.03) + (resource * 0.04);
        double probability = Math.min(0.99, Math.max(0.05, score));
        String prediction = probability >= 0.5 ? "Conflict" : "No Conflict";

        ConflictResult result = new ConflictResult();
        result.setConflictPrediction(prediction);
        result.setConflictProbability(Math.round(probability * 10000.0) / 10000.0);
        return result;
    }

    private PriorityResult computeFallbackPriority(ProjectRequest req) {
        double budget = req.getBudgetLakhs() != null ? req.getBudgetLakhs() : 10.0;
        int duration = req.getDurationDays() != null ? req.getDurationDays() : 30;
        int traffic = req.getTrafficDensity() != null ? req.getTrafficDensity() : 5;
        double weather = req.getWeatherRisk() != null ? req.getWeatherRisk() / 10.0 : 0.5;
        int utility = req.getUtilityDependency() != null ? req.getUtilityDependency() : 5;
        int population = req.getPopulationDensity() != null ? req.getPopulationDensity() : 5;
        int critical = req.getCriticalInfrastructure() != null ? req.getCriticalInfrastructure() : 5;
        int citizen = req.getCitizenImpact() != null ? req.getCitizenImpact() : 5;
        int resource = req.getResourceRequirement() != null ? req.getResourceRequirement() : 5;
        int contractor = req.getContractorAvailability() != null ? req.getContractorAvailability() : 5;

        double score = 0.35 + (budget / 1000.0) * 0.15 + (duration / 365.0) * 0.1 + (traffic / 10.0) * 0.10 + (weather * 0.10);
        score += (utility / 10.0) * 0.08 + (population / 10.0) * 0.08 + (critical / 10.0) * 0.08 + (citizen / 10.0) * 0.08;
        score += (resource / 10.0) * 0.04 + (contractor / 10.0) * 0.03;
        score = Math.min(0.95, Math.max(0.05, score));

        String label;
        if (score >= 0.75) {
            label = "High";
        } else if (score >= 0.55) {
            label = "Medium";
        } else {
            label = "Low";
        }

        PriorityResult result = new PriorityResult();
        result.setPriorityPrediction(label);
        return result;
    }

    public static class ConflictResult {
        private String conflictPrediction;
        private Double conflictProbability;

        public String getConflictPrediction() {
            return conflictPrediction;
        }

        public void setConflictPrediction(String conflictPrediction) {
            this.conflictPrediction = conflictPrediction;
        }

        public Double getConflictProbability() {
            return conflictProbability;
        }

        public void setConflictProbability(Double conflictProbability) {
            this.conflictProbability = conflictProbability;
        }
    }

    public static class PriorityResult {
        private String priorityPrediction;

        public String getPriorityPrediction() {
            return priorityPrediction;
        }

        public void setPriorityPrediction(String priorityPrediction) {
            this.priorityPrediction = priorityPrediction;
        }
    }
}
