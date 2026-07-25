package com.smartcity.entity;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RoleTest {

    @Test
    void mapsUiRoleIdsToBackendRoles() {
        assertEquals(Role.CITIZEN, Role.fromValue("citizen"));
        assertEquals(Role.DEPARTMENT_OFFICER, Role.fromValue("officer"));
        assertEquals(Role.ADMIN, Role.fromValue("admin"));
    }
}