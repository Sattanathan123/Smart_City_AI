package com.smartcity.entity;

public enum Role {
    ADMIN,
    DEPARTMENT_OFFICER,
    CITIZEN;

    public static Role fromValue(String value) {
        if (value == null) {
            return CITIZEN;
        }
        return switch (value.toLowerCase()) {
            case "admin" -> ADMIN;
            case "officer", "department_officer", "department-officer" -> DEPARTMENT_OFFICER;
            case "citizen" -> CITIZEN;
            default -> CITIZEN;
        };
    }
}
