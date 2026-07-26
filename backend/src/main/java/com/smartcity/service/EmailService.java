package com.smartcity.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:vbsattanathan@gmail.com}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String userName, String role, String employeeId) {
        try {
            log.info("Sending Welcome SMTP Email to '{}' (Role: '{}')", toEmail, role);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🏛️ [URBAN PULSE] Welcome to Smart Infrastructure Platform — Clearance Confirmed");

            String empInfo = (employeeId != null && !employeeId.trim().isEmpty())
                ? "\nOFFICIAL EMPLOYEE / CLEARANCE ID: " + employeeId + "\n"
                : "";

            String content = String.format(
                "URBAN PULSE — URBAN INFRASTRUCTURE GOVERNANCE SYSTEM\n" +
                "=================================================================\n\n" +
                "Dear %s,\n\n" +
                "Welcome to URBAN PULSE, the Municipal Corporation Infrastructure OS!\n\n" +
                "Your account authorization has been successfully registered.\n\n" +
                "ACCOUNT DETAILS:\n" +
                "-----------------------------------------------------------------\n" +
                "Registered Name: %s\n" +
                "Official Email:  %s\n" +
                "Authorization:   %s\n" +
                "%s" +
                "System Access:   Active & Cleared\n\n" +
                "-----------------------------------------------------------------\n" +
                "You can now access your dashboard and manage city infrastructure:\n" +
                "http://localhost:8080/login\n\n" +
                "Best regards,\n" +
                "Municipal Infrastructure Command Center\n" +
                "URBAN PULSE Governance System",
                userName,
                userName,
                toEmail,
                role,
                empInfo
            );

            message.setText(content);
            mailSender.send(message);
            log.info("Successfully sent Welcome Email to '{}'", toEmail);

        } catch (Exception e) {
            log.warn("SMTP Welcome Email to '{}' logged locally: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendComplaintTrackingEmail(String citizenEmail, Long trackingId, String category, String zone, String description, String assignedOfficer) {
        try {
            log.info("Sending Complaint Tracking Email to '{}' | ID: #{}", citizenEmail, trackingId);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(citizenEmail);
            message.setSubject("📋 [URBAN PULSE] Civic Complaint Registration & Tracking Identifier #" + trackingId);

            String content = String.format(
                "URBAN PULSE — CIVIC INFRASTRUCTURE DISPATCH\n" +
                "=================================================================\n\n" +
                "Your civic infrastructure complaint has been registered in the system.\n\n" +
                "COMPLAINT TRACKING SUMMARY:\n" +
                "-----------------------------------------------------------------\n" +
                "TRACKING IDENTIFIER: #%d\n" +
                "Issue Category:      %s\n" +
                "Municipal Zone:      %s\n" +
                "Status:              SUBMITTED / UNDER REVIEW\n" +
                "Assigned Office:     %s Division Control\n\n" +
                "DETAILS:\n%s\n\n" +
                "-----------------------------------------------------------------\n" +
                "You can track real-time resolution progress anytime on our portal:\n" +
                "http://localhost:8080/citizen\n\n" +
                "Thank you for helping keep our city infrastructure safe,\n" +
                "URBAN PULSE Control Center",
                trackingId,
                category,
                zone,
                category,
                description
            );

            message.setText(content);
            mailSender.send(message);
            log.info("Successfully sent Complaint Tracking Email for #{}", trackingId);

        } catch (Exception e) {
            log.warn("SMTP Tracking Email for #{} logged locally: {}", trackingId, e.getMessage());
        }
    }

    @Async
    public void sendOfficerNotificationEmail(String officerEmail, String officerName, Long trackingId, String category, String zone, String priority, String description) {
        try {
            log.info("Sending High-Priority Officer Alert Email to '{}' | Ticket #{}", officerEmail, trackingId);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(officerEmail);
            message.setSubject("🚨 [URBAN PULSE ALERT] Action Required — Ticket #" + trackingId + " (" + priority + " Priority)");

            String content = String.format(
                "URBAN PULSE — OFFICER DISPATCH NOTIFICATION\n" +
                "=================================================================\n\n" +
                "Attention Officer %s,\n\n" +
                "A new infrastructure ticket requires your department's review and action.\n\n" +
                "TICKET DETAILS:\n" +
                "-----------------------------------------------------------------\n" +
                "Ticket Identifier:  #%d\n" +
                "Department Sector:  %s\n" +
                "Municipal Zone:     %s\n" +
                "Action Priority:    %s\n\n" +
                "DESCRIPTION:\n%s\n\n" +
                "-----------------------------------------------------------------\n" +
                "Please log in to inspect and update task resolution:\n" +
                "http://localhost:8080/officer\n\n" +
                "URBAN PULSE Automated Dispatch Engine",
                officerName,
                trackingId,
                category,
                zone,
                priority,
                description
            );

            message.setText(content);
            mailSender.send(message);
            log.info("Successfully sent Officer Alert Email for Ticket #{}", trackingId);

        } catch (Exception e) {
            log.warn("SMTP Officer Email for Ticket #{} logged locally: {}", trackingId, e.getMessage());
        }
    }

    @Async
    public void sendAlertNotification(String toEmail, String subject, String alertTitle, String alertDescription) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🚨 [URBAN PULSE Alert] " + subject);

            String content = String.format(
                "URBAN PULSE — SYSTEM NOTIFICATION\n" +
                "====================================================\n\n" +
                "ALERT TITLE: %s\n\n" +
                "DETAILS:\n%s\n\n" +
                "----------------------------------------------------\n" +
                "Access Command Dashboard:\nhttp://localhost:8080/",
                alertTitle,
                alertDescription
            );

            message.setText(content);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("SMTP Notification to '{}' logged locally: {}", toEmail, e.getMessage());
        }
    }
}
