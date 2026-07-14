package com.smartcity.dto;

import java.time.LocalDateTime;

public class AlertResponse {
    public Long id;
    public String type;
    public String title;
    public String description;
    public Boolean active;
    public LocalDateTime createdAt;

    public AlertResponse(Long id, String type, String title, String description,
                         Boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.active = active;
        this.createdAt = createdAt;
    }
}
