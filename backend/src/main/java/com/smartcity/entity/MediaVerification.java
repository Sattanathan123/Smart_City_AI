package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_verification")
public class MediaVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID verificationId;

    private Long complaintId;
    private String fileName;
    private String mediaType; // IMAGE or VIDEO
    private Integer authenticityScore;
    private String verificationStatus; // AUTHENTIC or SUSPICIOUS
    @Column(columnDefinition = "TEXT")
    private String detectionReason; // JSON array of reasons
    private LocalDateTime uploadedTime;

    // Getters and Setters
    public UUID getVerificationId() { return verificationId; }
    public void setVerificationId(UUID verificationId) { this.verificationId = verificationId; }
    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public Integer getAuthenticityScore() { return authenticityScore; }
    public void setAuthenticityScore(Integer authenticityScore) { this.authenticityScore = authenticityScore; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public String getDetectionReason() { return detectionReason; }
    public void setDetectionReason(String detectionReason) { this.detectionReason = detectionReason; }
    public LocalDateTime getUploadedTime() { return uploadedTime; }
    public void setUploadedTime(LocalDateTime uploadedTime) { this.uploadedTime = uploadedTime; }
}
