package com.smartcity.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String action;

    @Column(length = 1000)
    private String details;

    private String ipAddress;

    private LocalDateTime timestamp = LocalDateTime.now();

    public AuditLog(String userEmail, String role, String action, String details, String ipAddress) {
        this.userEmail = userEmail;
        this.role = role;
        this.action = action;
        this.details = details;
        this.ipAddress = ipAddress;
        this.timestamp = LocalDateTime.now();
    }
}
