package com.smartcity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequest {
    private Long userId;
    private String userName;

    @NotBlank
    private String category;

    private String description;

    @NotBlank
    private String zone;

    private String imageUrl;
}
