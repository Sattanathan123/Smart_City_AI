package com.smartcity.dto;

import java.time.LocalDateTime;

public class ComplaintResponse {
    public Long id;
    public Long userId;
    public String userName;
    public String category;
    public String description;
    public String zone;
    public String imageUrl;
    public String status;
    public Integer progress;
    public LocalDateTime createdAt;
    public String mediaType;
    public Integer authenticityScore;
    public String verificationStatus;
    public String detectionReason;
    public String assignedOfficer;

    public ComplaintResponse(Long id, Long userId, String userName, String category,
                              String description, String zone, String imageUrl,
                              String status, Integer progress, LocalDateTime createdAt) {
        this(id, userId, userName, category, description, zone, imageUrl, status, progress, createdAt, null, null, null, null, null);
    }

    public ComplaintResponse(Long id, Long userId, String userName, String category,
                              String description, String zone, String imageUrl,
                              String status, Integer progress, LocalDateTime createdAt,
                              String mediaType, Integer authenticityScore, String verificationStatus, String detectionReason,
                              String assignedOfficer) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.category = category;
        this.description = description;
        this.zone = zone;
        this.imageUrl = imageUrl;
        this.status = status;
        this.progress = progress;
        this.createdAt = createdAt;
        this.mediaType = mediaType;
        this.authenticityScore = authenticityScore;
        this.verificationStatus = verificationStatus;
        this.detectionReason = detectionReason;
        this.assignedOfficer = assignedOfficer;
    }
}
