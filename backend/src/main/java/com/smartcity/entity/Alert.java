package com.smartcity.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // warning, info, success

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private Boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
