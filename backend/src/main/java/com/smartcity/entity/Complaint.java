package com.smartcity.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;

    @Column(nullable = false)
    private String category;

    @Column(length = 1000)
    private String description;

    private String zone;
    private String imageUrl;

    @Column(nullable = false)
    private String status; // SUBMITTED, UNDER_REVIEW, ASSIGNED, IN_PROGRESS, RESOLVED

    private Integer progress; // 0-100

    @CreationTimestamp
    private LocalDateTime createdAt;
}
