package com.smartcity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "project_dependencies")
@Data
@NoArgsConstructor
public class ProjectDependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private Long dependsOnProjectId;

    @Column(length = 32)
    private String dependencyType;

    private LocalDateTime createdAt = LocalDateTime.now();
}
