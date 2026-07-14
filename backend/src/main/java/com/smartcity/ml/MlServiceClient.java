package com.smartcity.ml;

import com.smartcity.dto.ProjectRequest;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

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
        return restTemplate.postForObject(baseUrl + "/predict/conflict", request, ConflictResult.class);
    }

    public PriorityResult predictPriority(ProjectRequest request) {
        return restTemplate.postForObject(baseUrl + "/predict/priority", request, PriorityResult.class);
    }

    @Data
    public static class ConflictResult {
        private String conflictPrediction;
        private Double conflictProbability;
    }

    @Data
    public static class PriorityResult {
        private String priorityPrediction;
    }
}
