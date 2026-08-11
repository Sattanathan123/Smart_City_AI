package com.smartcity.service;

import com.smartcity.entity.AuditLog;
import com.smartcity.entity.Complaint;
import com.smartcity.entity.Project;
import com.smartcity.repository.AuditLogRepository;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.ProjectRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelExportService {

    private final ComplaintRepository complaintRepository;
    private final ProjectRepository projectRepository;
    private final AuditLogRepository auditLogRepository;

    public ExcelExportService(ComplaintRepository complaintRepository,
                              ProjectRepository projectRepository,
                              AuditLogRepository auditLogRepository) {
        this.complaintRepository = complaintRepository;
        this.projectRepository = projectRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public byte[] exportComplaintsToExcel() {
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Complaints Report");

            // Header Style
            CellStyle headerStyle = createHeaderStyle(workbook);

            Row headerRow = sheet.createRow(0);
            String[] columns = {"Complaint ID", "Citizen Name", "Category", "Zone", "Description", "Assigned Officer", "Status", "Progress %", "Created Date"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            for (Complaint c : complaints) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(c.getId());
                row.createCell(1).setCellValue(c.getUserName() != null ? c.getUserName() : "Citizen");
                row.createCell(2).setCellValue(c.getCategory());
                row.createCell(3).setCellValue(c.getZone());
                row.createCell(4).setCellValue(c.getDescription() != null ? c.getDescription() : "");
                row.createCell(5).setCellValue(c.getAssignedOfficer() != null ? c.getAssignedOfficer() : "Unassigned");
                row.createCell(6).setCellValue(c.getStatus());
                row.createCell(7).setCellValue(c.getProgress() != null ? c.getProgress() : 0);
                row.createCell(8).setCellValue(c.getCreatedAt() != null ? c.getCreatedAt().format(formatter) : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export Complaints to Excel: " + e.getMessage(), e);
        }
    }

    public byte[] exportProjectsToExcel() {
        List<Project> projects = projectRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Projects Report");

            CellStyle headerStyle = createHeaderStyle(workbook);

            Row headerRow = sheet.createRow(0);
            String[] columns = {"Project ID", "Project Name", "Department", "Zone", "Project Type", "Budget (Lakhs)", "Duration (Days)", "Status", "Sanctioned By"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (Project p : projects) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getProjectName());
                row.createCell(2).setCellValue(p.getDepartment());
                row.createCell(3).setCellValue(p.getZone());
                row.createCell(4).setCellValue(p.getProjectType());
                row.createCell(5).setCellValue(p.getBudgetLakhs() != null ? p.getBudgetLakhs() : 0.0);
                row.createCell(6).setCellValue(p.getDurationDays() != null ? p.getDurationDays() : 0);
                row.createCell(7).setCellValue(p.getStatus());
                row.createCell(8).setCellValue(p.getSanctionedBy() != null ? p.getSanctionedBy() : "Pending");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export Projects to Excel: " + e.getMessage(), e);
        }
    }

    public byte[] exportAuditLogsToExcel() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Audit Logs");

            CellStyle headerStyle = createHeaderStyle(workbook);

            Row headerRow = sheet.createRow(0);
            String[] columns = {"Log ID", "User Email", "Role", "Action", "Details", "IP Address", "Timestamp"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            for (AuditLog l : logs) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(l.getId());
                row.createCell(1).setCellValue(l.getUserEmail());
                row.createCell(2).setCellValue(l.getRole());
                row.createCell(3).setCellValue(l.getAction());
                row.createCell(4).setCellValue(l.getDetails() != null ? l.getDetails() : "");
                row.createCell(5).setCellValue(l.getIpAddress() != null ? l.getIpAddress() : "");
                row.createCell(6).setCellValue(l.getTimestamp() != null ? l.getTimestamp().format(formatter) : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export Audit Logs to Excel: " + e.getMessage(), e);
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }
}
