package com.smartcity.service;

import com.smartcity.entity.Notification;
import com.smartcity.repository.NotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository repo, SimpMessagingTemplate messagingTemplate) {
        this.repo = repo;
        this.messagingTemplate = messagingTemplate;
    }

    public Notification sendNotification(String recipientRole, Long recipientUserId, String title, String message, String type) {
        Notification notification = new Notification(recipientRole, recipientUserId, title, message, type);
        Notification saved = repo.save(notification);

        try {
            // Broadcast live via WebSocket
            messagingTemplate.convertAndSend("/topic/notifications", saved);
            if (recipientRole != null) {
                messagingTemplate.convertAndSend("/topic/" + recipientRole.toLowerCase() + "-notifications", saved);
            }
        } catch (Exception ex) {
            System.err.println("Failed to broadcast WebSocket notification: " + ex.getMessage());
        }

        return saved;
    }

    public List<Notification> getNotificationsForUser(String role, Long userId) {
        return repo.findForUser(role != null ? role.toUpperCase() : "CITIZEN", userId != null ? userId : 0L);
    }

    public void markAsRead(Long notificationId) {
        repo.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            repo.save(n);
        });
    }
}
