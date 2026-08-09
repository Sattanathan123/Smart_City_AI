package com.smartcity.dto;

import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.web.multipart.MultipartFile;

public class ComplaintRequest {
    private Long userId;
    private String userName;

    @NotBlank
    private String category;

    private String description;

    @NotBlank
    private String zone;

    // Existing field for stored image URL/path
    private String imageUrl;

    // New field for uploaded image or video file
    @JsonIgnore
    private MultipartFile image;
    @JsonIgnore
    private MultipartFile video;
    @JsonIgnore
    private MultipartFile media;

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
    public MultipartFile getImage() { 
        if (image != null) return image;
        if (video != null) return video;
        return media;
    }
    public void setImage(MultipartFile image) { this.image = image; }
    public MultipartFile getVideo() { return video; }
    public void setVideo(MultipartFile video) { this.video = video; }
    public MultipartFile getMedia() { return media; }
    public void setMedia(MultipartFile media) { this.media = media; }
}
