package com.smartcity.controller;

import com.smartcity.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final ProjectRepository projectRepository;

    public AnalyticsController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<Map<String, Object>>> getMonthly() {
        List<Object[]> rows = projectRepository.getMonthlyProjectStats();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", row[0]);
            m.put("started", row[1]);
            m.put("completed", row[2]);
            result.add(m);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Map<String, Object>>> getDepartments() {
        List<Object[]> rows = projectRepository.getDepartmentStats();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("dept", row[0]);
            m.put("total", row[1]);
            m.put("completed", row[2]);
            long total = ((Number) row[1]).longValue();
            long completed = ((Number) row[2]).longValue();
            m.put("score", total == 0 ? 0 : Math.round((completed * 100.0) / total));
            result.add(m);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/priority-distribution")
    public ResponseEntity<List<Map<String, Object>>> getPriorityDistribution() {
        List<Object[]> rows = projectRepository.getPriorityDistribution();
        String[] colors = {"var(--color-chart-1)", "var(--color-chart-3)", "var(--color-chart-2)"};
        List<Map<String, Object>> result = new ArrayList<>();
        int i = 0;
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("name", row[0]);
            m.put("value", row[1]);
            m.put("color", colors[i % colors.length]);
            result.add(m);
            i++;
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/status-distribution")
    public ResponseEntity<List<Map<String, Object>>> getStatusDistribution() {
        List<Object[]> rows = projectRepository.getStatusDistribution();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("name", row[0]);
            m.put("value", row[1]);
            result.add(m);
        }
        return ResponseEntity.ok(result);
    }
}
