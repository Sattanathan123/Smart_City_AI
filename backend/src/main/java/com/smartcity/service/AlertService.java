package com.smartcity.service;

import com.smartcity.dto.AlertResponse;
import com.smartcity.entity.Alert;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.AlertRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertRepository repo;
    private final EmailService emailService;

    public AlertService(AlertRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    public List<AlertResponse> getActive() {
        return repo.findByActiveTrueOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public AlertResponse create(Alert alert) {
        alert.setActive(true);
        Alert saved = repo.save(alert);

        emailService.sendAlertNotification(
            "vbsattanathan@gmail.com",
            saved.getTitle(),
            saved.getTitle(),
            saved.getDescription()
        );

        return toResponse(saved);
    }

    public void dismiss(Long id) {
        Alert a = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
        a.setActive(false);
        repo.save(a);
    }

    private AlertResponse toResponse(Alert a) {
        return new AlertResponse(a.getId(), a.getType(), a.getTitle(),
                a.getDescription(), a.getActive(), a.getCreatedAt());
    }
}
