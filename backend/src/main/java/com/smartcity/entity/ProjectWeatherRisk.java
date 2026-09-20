package com.smartcity.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_weather_risk")
public class ProjectWeatherRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "forecast_date")
    private LocalDateTime forecastDate;

    @Column(name = "workability_score")
    private Integer workabilityScore;

    @Column(name = "risk_level")
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "recommended_action")
    private String recommendedAction; // CONTINUE, CAUTION, REVIEW, DELAY, STOP, PRIORITIZE

    @Column(name = "delay_hours")
    private Integer delayHours;

    @Column(name = "weather_summary", length = 500)
    private String weatherSummary;

    @Column(name = "risk_reasons", length = 1000)
    private String riskReasons;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public LocalDateTime getForecastDate() { return forecastDate; }
    public void setForecastDate(LocalDateTime forecastDate) { this.forecastDate = forecastDate; }

    public Integer getWorkabilityScore() { return workabilityScore; }
    public void setWorkabilityScore(Integer workabilityScore) { this.workabilityScore = workabilityScore; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }

    public Integer getDelayHours() { return delayHours; }
    public void setDelayHours(Integer delayHours) { this.delayHours = delayHours; }

    public String getWeatherSummary() { return weatherSummary; }
    public void setWeatherSummary(String weatherSummary) { this.weatherSummary = weatherSummary; }

    public String getRiskReasons() { return riskReasons; }
    public void setRiskReasons(String riskReasons) { this.riskReasons = riskReasons; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
