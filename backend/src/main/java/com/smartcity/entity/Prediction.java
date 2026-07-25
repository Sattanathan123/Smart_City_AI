package com.smartcity.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    private Double conflictProbability;
    private String conflictPrediction;
    private String priorityPrediction;

    @CreationTimestamp
    private LocalDateTime predictionTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Double getConflictProbability() {
        return conflictProbability;
    }

    public void setConflictProbability(Double conflictProbability) {
        this.conflictProbability = conflictProbability;
    }

    public String getConflictPrediction() {
        return conflictPrediction;
    }

    public void setConflictPrediction(String conflictPrediction) {
        this.conflictPrediction = conflictPrediction;
    }

    public String getPriorityPrediction() {
        return priorityPrediction;
    }

    public void setPriorityPrediction(String priorityPrediction) {
        this.priorityPrediction = priorityPrediction;
    }

    public LocalDateTime getPredictionTime() {
        return predictionTime;
    }

    public void setPredictionTime(LocalDateTime predictionTime) {
        this.predictionTime = predictionTime;
    }
}
