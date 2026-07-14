package com.smartcity.dto;

import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String department;
    private Role role;
    private LocalDateTime createdAt;

    public static UserResponse from(User u) {
        UserResponse r = new UserResponse();
        r.id = u.getId();
        r.name = u.getName();
        r.email = u.getEmail();
        r.department = u.getDepartment();
        r.role = u.getRole();
        r.createdAt = u.getCreatedAt();
        return r;
    }
}
