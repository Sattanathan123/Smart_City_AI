package com.smartcity.service;

import com.smartcity.dto.ComplaintRequest;
import com.smartcity.dto.ComplaintResponse;
import com.smartcity.entity.Complaint;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.ComplaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import java.nio.file.Path;
import java.nio.file.Files;
import java.util.UUID;
import org.springframework.util.StringUtils;
import java.io.IOException;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository repo;
    private final EmailService emailService;

    private final Path fileStorageLocation;

public ComplaintService(ComplaintRepository repo, EmailService emailService, @Autowired Path fileStorageLocation) {
        this.repo = repo;
        this.emailService = emailService;
        this.fileStorageLocation = fileStorageLocation;
    }

    public ComplaintResponse create(ComplaintRequest req) {
        Complaint c = new Complaint();
        c.setUserId(req.getUserId());
        c.setUserName(req.getUserName());
        c.setCategory(req.getCategory());
        c.setDescription(req.getDescription());
        c.setZone(req.getZone());
        // Handle uploaded image
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            String originalFilename = StringUtils.cleanPath(req.getImage().getOriginalFilename());
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String filename = UUID.randomUUID().toString() + fileExtension;
            try {
                Path targetLocation = this.fileStorageLocation.resolve(filename);
                Files.copy(req.getImage().getInputStream(), targetLocation);
                c.setImageUrl(filename);
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + filename + ". Please try again!", ex);
            }
        } else {
            c.setImageUrl(req.getImageUrl());
        }
        c.setStatus("SUBMITTED");
        c.setProgress(0);
        Complaint saved = repo.save(c);

        // 1. Send Tracking Email to Citizen with Tracking ID #
        String citizenEmail = "vbsattanathan@gmail.com";
        emailService.sendComplaintTrackingEmail(
            citizenEmail,
            saved.getId(),
            saved.getCategory(),
            saved.getZone(),
            saved.getDescription(),
            saved.getCategory() + " Department Officer"
        );

        // 2. Send Urgent Dispatch Email to Department Officer based on Priority/Category
        emailService.sendOfficerNotificationEmail(
            "vbsattanathan@gmail.com",
            saved.getCategory() + " Officer",
            saved.getId(),
            saved.getCategory(),
            saved.getZone(),
            "HIGH",
            saved.getDescription()
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
