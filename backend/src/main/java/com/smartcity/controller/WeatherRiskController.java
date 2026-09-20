package com.smartcity.controller;

import com.smartcity.entity.Project;
import com.smartcity.entity.ProjectWeatherRisk;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.ml.MlServiceClient;
import com.smartcity.repository.ProjectRepository;
import com.smartcity.repository.ProjectWeatherRiskRepository;
import com.smartcity.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherRiskController {

    private final WeatherService weatherService;
    private final ProjectWeatherRiskRepository weatherRiskRepository;
    private final ProjectRepository projectRepository;
    private final MlServiceClient mlServiceClient;

    public WeatherRiskController(WeatherService weatherService,
                                 ProjectWeatherRiskRepository weatherRiskRepository,
                                 ProjectRepository projectRepository,
                                 MlServiceClient mlServiceClient) {
        this.weatherService = weatherService;
        this.weatherRiskRepository = weatherRiskRepository;
        this.projectRepository = projectRepository;
        this.mlServiceClient = mlServiceClient;
    }

    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentWeather(@RequestParam(required = false, defaultValue = "Zone 1") String zone) {
        return ResponseEntity.ok(weatherService.getWeatherForZone(zone));
    }

    @GetMapping("/risk/projects")
    public ResponseEntity<List<ProjectWeatherRisk>> getAllWeatherRisks() {
        return ResponseEntity.ok(weatherRiskRepository.findAll());
    }

    @GetMapping("/risk/project/{id}")
    public ResponseEntity<ProjectWeatherRisk> getProjectWeatherRisk(@PathVariable Long id) {
        ProjectWeatherRisk risk = weatherRiskRepository.findFirstByProjectIdOrderByCreatedAtDesc(id)
                .orElseThrow(() -> new ResourceNotFoundException("No weather risk record for project " + id));
        return ResponseEntity.ok(risk);
    }

    @PostMapping("/risk/evaluate/{projectId}")
    public ResponseEntity<ProjectWeatherRisk> evaluateWeatherRisk(@PathVariable Long projectId) {
        Project p = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        Map<String, Object> forecast = weatherService.getWeatherForZone(p.getZone());
        Map<String, Object> mlResult = mlServiceClient.predictWeatherRisk(p.getProjectType(), p.getZone(), forecast);

        ProjectWeatherRisk risk = new ProjectWeatherRisk();
        risk.setProjectId(p.getId());
        risk.setWorkabilityScore((Integer) mlResult.getOrDefault("workabilityScore", 75));
        risk.setRiskLevel((String) mlResult.getOrDefault("riskLevel", "LOW"));
        risk.setRecommendedAction((String) mlResult.getOrDefault("recommendedAction", "CONTINUE"));
        risk.setDelayHours((Integer) mlResult.getOrDefault("delayHours", 0));
        risk.setWeatherSummary((String) mlResult.getOrDefault("weatherSummary", "Clear"));

        Object reasonsObj = mlResult.get("reason");
        if (reasonsObj instanceof List) {
            risk.setRiskReasons(String.join("; ", (List<String>) reasonsObj));
        } else {
            risk.setRiskReasons(String.valueOf(reasonsObj));
        }

        ProjectWeatherRisk saved = weatherRiskRepository.save(risk);
        return ResponseEntity.ok(saved);
    }
}
