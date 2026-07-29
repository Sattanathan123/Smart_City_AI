package com.smartcity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_predictions")
@Data
@NoArgsConstructor
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private String type; // "conflict" or "priority"

    @Column(nullable = false)
    private Double score;

    private LocalDateTime createdAt = LocalDateTime.now();

    public AiPrediction(Long projectId, String type, Double score) {
        this.projectId = projectId;
        this.type = type;
        this.score = score;
        this.createdAt = LocalDateTime.now();
    }
}
