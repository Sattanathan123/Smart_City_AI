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

    public ComplaintResponse(Long id, Long userId, String userName, String category,
                              String description, String zone, String imageUrl,
                              String status, Integer progress, LocalDateTime createdAt) {
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
    }
}
