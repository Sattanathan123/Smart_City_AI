package com.smartcity.controller;

import com.smartcity.service.ExcelExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/export", "/export"})
public class ExportController {

    private final ExcelExportService excelExportService;

    public ExportController(ExcelExportService excelExportService) {
        this.excelExportService = excelExportService;
    }

    @GetMapping("/complaints")
    public ResponseEntity<byte[]> exportComplaints() {
        byte[] excel = excelExportService.exportComplaintsToExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=URBAN_PULSE_Complaints_Report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @GetMapping("/projects")
    public ResponseEntity<byte[]> exportProjects() {
        byte[] excel = excelExportService.exportProjectsToExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=URBAN_PULSE_Projects_Report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<byte[]> exportAuditLogs() {
        byte[] excel = excelExportService.exportAuditLogsToExcel();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=URBAN_PULSE_Audit_Logs.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}
