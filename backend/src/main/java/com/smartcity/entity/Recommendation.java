package com.smartcity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
@Data
@NoArgsConstructor
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false, length = 500)
    private String issue;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Column(nullable = false, length = 500)
    private String action;

    @Column(nullable = false, length = 500)
    private String benefit;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Recommendation(Long projectId, String issue, String reason, String action, String benefit) {
        this.projectId = projectId;
        this.issue = issue;
        this.reason = reason;
        this.action = action;
        this.benefit = benefit;
        this.createdAt = LocalDateTime.now();
    }
}
