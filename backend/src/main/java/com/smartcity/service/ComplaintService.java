package com.smartcity.service;

import com.smartcity.dto.ComplaintRequest;
import com.smartcity.dto.ComplaintResponse;
import com.smartcity.entity.Complaint;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository repo;
    private final EmailService emailService;

    public ComplaintService(ComplaintRepository repo, EmailService emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    public ComplaintResponse create(ComplaintRequest req) {
        Complaint c = new Complaint();
        c.setUserId(req.getUserId());
        c.setUserName(req.getUserName());
        c.setCategory(req.getCategory());
        c.setDescription(req.getDescription());
        c.setZone(req.getZone());
        c.setImageUrl(req.getImageUrl());
        c.setStatus("SUBMITTED");
        c.setProgress(0);
        Complaint saved = repo.save(c);

        emailService.sendAlertNotification(
            "vbsattanathan@gmail.com",
            "New Citizen Complaint: " + saved.getCategory() + " (" + saved.getZone() + ")",
            "Citizen Complaint Submitted by " + saved.getUserName(),
            "Category: " + saved.getCategory() + "\nZone: " + saved.getZone() + "\nDescription: " + saved.getDescription()
        );

        return toResponse(saved);
    }

    public List<ComplaintResponse> getByUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    public List<ComplaintResponse> getAll() {
        return repo.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public ComplaintResponse getById(Long id) {
        return toResponse(repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id)));
    }

    public ComplaintResponse updateStatus(Long id, String status, Integer progress) {
        Complaint c = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        c.setStatus(status);
        c.setProgress(progress);
        Complaint saved = repo.save(c);

        emailService.sendAlertNotification(
            "vbsattanathan@gmail.com",
            "Complaint Progress Update #" + saved.getId() + " - " + status,
            "Complaint Status Changed to " + status + " (" + progress + "%)",
            "Complaint #" + saved.getId() + " (" + saved.getCategory() + " in " + saved.getZone() + ") updated to " + status + " with " + progress + "% progress."
        );

        return toResponse(saved);
    }

    private ComplaintResponse toResponse(Complaint c) {
        return new ComplaintResponse(c.getId(), c.getUserId(), c.getUserName(),
                c.getCategory(), c.getDescription(), c.getZone(),
                c.getImageUrl(), c.getStatus(), c.getProgress(), c.getCreatedAt());
    }
}
