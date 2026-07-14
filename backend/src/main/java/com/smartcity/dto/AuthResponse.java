package com.smartcity.dto;

public class AuthResponse {
    public Long id;
    public String name;
    public String email;
    public String phone;
    public String department;
    public String role;
    public String token;
    public String message;

    public AuthResponse(Long id, String name, String email, String phone, String department,
                        String role, String token, String message) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.role = role;
        this.token = token;
        this.message = message;
    }
}
