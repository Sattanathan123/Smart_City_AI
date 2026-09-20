package com.smartcity.repository;

import com.smartcity.entity.ProjectWeatherRisk;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProjectWeatherRiskRepository extends JpaRepository<ProjectWeatherRisk, Long> {
    Optional<ProjectWeatherRisk> findFirstByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<ProjectWeatherRisk> findByRiskLevel(String riskLevel);
    List<ProjectWeatherRisk> findByRecommendedAction(String recommendedAction);
}
