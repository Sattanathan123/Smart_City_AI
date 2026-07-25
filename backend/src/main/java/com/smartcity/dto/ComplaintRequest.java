package com.smartcity.dto;

import jakarta.validation.constraints.NotBlank;

public class ComplaintRequest {
    private Long userId;
    private String userName;

    @NotBlank
    private String category;

    private String description;

    @NotBlank
    private String zone;

    private String imageUrl;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
