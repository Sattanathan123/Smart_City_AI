package com.smartcity.service;

import com.smartcity.entity.AuditLog;
import com.smartcity.repository.AuditLogRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    public void logAction(String userEmail, String role, String action, String details, String ipAddress) {
        try {
            AuditLog log = new AuditLog(userEmail, role, action, details, ipAddress);
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Audit logging failed: " + e.getMessage());
        }
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> searchLogs(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllLogs();
        }
        return auditLogRepository.searchLogs(query.trim());
    }
}
