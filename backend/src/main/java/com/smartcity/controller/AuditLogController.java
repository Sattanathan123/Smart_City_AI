package com.smartcity.controller;

import com.smartcity.entity.AuditLog;
import com.smartcity.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/admin/audit-logs", "/admin/audit-logs"})
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(auditLogService.getAllLogs(query));
    }
}
