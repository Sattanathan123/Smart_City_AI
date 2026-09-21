package com.smartcity.controller;

import com.smartcity.service.PdfReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/reports", "/reports"})
public class ReportController {

    private final PdfReportService pdfReportService;

    public ReportController(PdfReportService pdfReportService) {
        this.pdfReportService = pdfReportService;
    }

    @GetMapping("/complaint/{id}/pdf")
    public ResponseEntity<byte[]> downloadComplaintPdf(@PathVariable Long id) {
        byte[] pdf = pdfReportService.generateComplaintPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=URBAN_PULSE_Complaint_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/project/{id}/pdf")
    public ResponseEntity<byte[]> downloadProjectPdf(@PathVariable Long id) {
        byte[] pdf = pdfReportService.generateProjectPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=URBAN_PULSE_Project_" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/analytics/monthly/pdf")
    public ResponseEntity<byte[]> downloadAnalyticsPdf(@RequestParam(required = false, defaultValue = "30d") String timeRange) {
        byte[] pdf = pdfReportService.generateAnalyticsPdf(timeRange);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=URBAN_PULSE_Executive_Analytics.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
