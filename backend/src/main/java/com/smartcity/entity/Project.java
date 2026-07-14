package com.smartcity.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String projectName;

    private String department;
    private String projectType;
    private String zone;

    private Double budgetLakhs;
    private Integer durationDays;
    private Integer trafficDensity;
    private Integer weatherRisk;
    private Integer utilityDependency;
    private Integer populationDensity;
    private Integer criticalInfrastructure;
    private Integer citizenImpact;
    private Integer resourceRequirement;
    private Integer contractorAvailability;

    @Column(nullable = false)
    private String status;

    private String createdBy;  // email of the officer who created
    private String sanctionedBy;
    private String sanctionRemark;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Prediction prediction;
}
