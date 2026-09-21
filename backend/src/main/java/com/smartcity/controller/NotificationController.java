package com.smartcity.controller;

import com.smartcity.entity.Notification;
import com.smartcity.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/notifications", "/notifications"})
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(required = false, defaultValue = "CITIZEN") String role,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(role, userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
