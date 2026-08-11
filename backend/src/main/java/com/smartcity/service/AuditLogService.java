package com.smartcity.service;

import com.smartcity.entity.AuditLog;
import com.smartcity.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository repo;

    public AuditLogService(AuditLogRepository repo) {
        this.repo = repo;
    }

    public AuditLog logAction(String userEmail, String role, String action, String details, String ipAddress) {
        AuditLog log = new AuditLog(
            userEmail != null ? userEmail : "system@smartcity.gov.in",
            role != null ? role : "SYSTEM",
            action,
            details,
            ipAddress != null ? ipAddress : "127.0.0.1"
        );
        return repo.save(log);
    }

    public List<AuditLog> getAllLogs(String query) {
        if (query != null && !query.trim().isEmpty()) {
            return repo.searchLogs(query.trim());
        }
        return repo.findAllByOrderByTimestampDesc();
    }
}
