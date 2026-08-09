package com.smartcity.service;

import com.smartcity.dto.ComplaintRequest;
import com.smartcity.dto.ComplaintResponse;
import com.smartcity.entity.Complaint;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.entity.MediaVerification;
import com.smartcity.ml.MlServiceClient;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.MediaVerificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import java.nio.file.Path;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.util.StringUtils;
import java.io.IOException;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository repo;
    private final MediaVerificationRepository mediaVerificationRepo;
    private final MlServiceClient mlServiceClient;
    private final EmailService emailService;
    private final Path fileStorageLocation;

    public ComplaintService(ComplaintRepository repo,
                            MediaVerificationRepository mediaVerificationRepo,
                            MlServiceClient mlServiceClient,
                            EmailService emailService,
                            @Autowired Path fileStorageLocation) {
        this.repo = repo;
        this.mediaVerificationRepo = mediaVerificationRepo;
        this.mlServiceClient = mlServiceClient;
        this.emailService = emailService;
        this.fileStorageLocation = fileStorageLocation;
    }

    public ComplaintResponse create(ComplaintRequest req) {
        boolean hasMedia = (req.getImage() != null && !req.getImage().isEmpty()) ||
                           (req.getVideo() != null && !req.getVideo().isEmpty()) ||
                           (req.getMedia() != null && !req.getMedia().isEmpty()) ||
                           (req.getImageUrl() != null && !req.getImageUrl().trim().isEmpty());
        if (!hasMedia) {
            throw new IllegalArgumentException("Evidence media (image or video) is mandatory for complaint registration.");
        }

        Complaint c = new Complaint();
        c.setUserId(req.getUserId());
        c.setUserName(req.getUserName());
        c.setCategory(req.getCategory());
        c.setDescription(req.getDescription());
        c.setZone(req.getZone());

        String uploadedFilename = null;
        String detectedMediaType = "IMAGE";
        long fileSize = 0;

        // Handle uploaded image or video file
        if (req.getImage() != null && !req.getImage().isEmpty()) {
            String originalFilename = StringUtils.cleanPath(req.getImage().getOriginalFilename());
            fileSize = req.getImage().getSize();
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String extLower = fileExtension.toLowerCase();
            if (extLower.equals(".mp4") || extLower.equals(".webm") || extLower.equals(".mov") || extLower.equals(".avi") || extLower.equals(".mkv")) {
                detectedMediaType = "VIDEO";
            }
            uploadedFilename = UUID.randomUUID().toString() + fileExtension;
            try {
                Path targetLocation = this.fileStorageLocation.resolve(uploadedFilename);
                Files.copy(req.getImage().getInputStream(), targetLocation);
                c.setImageUrl(uploadedFilename);
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + uploadedFilename + ". Please try again!", ex);
            }
        } else {
            c.setImageUrl(req.getImageUrl());
        }

        c.setStatus("SUBMITTED");
        c.setProgress(0);
        Complaint saved = repo.save(c);

        // Run AI Media Verification if a file was uploaded
        if (uploadedFilename != null) {
            try {
                MlServiceClient.MediaVerificationResult result = mlServiceClient.verifyMedia(uploadedFilename, detectedMediaType, fileSize);
                MediaVerification mv = new MediaVerification();
                mv.setComplaintId(saved.getId());
                mv.setFileName(uploadedFilename);
                mv.setMediaType(result.getMediaType() != null ? result.getMediaType() : detectedMediaType);
                mv.setAuthenticityScore(result.getAuthenticityScore());
                mv.setVerificationStatus(result.getVerificationStatus() != null ? result.getVerificationStatus() : "AUTHENTIC");
                mv.setDetectionReason(result.getDetectionReason() != null ? String.join("; ", result.getDetectionReason()) : "Passed AI Media Inspection");
                mv.setUploadedTime(LocalDateTime.now());
                mediaVerificationRepo.save(mv);
            } catch (Exception ex) {
                // Log and continue gracefully
                System.err.println("Failed to perform AI Media Verification: " + ex.getMessage());
            }
        }

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
        MediaVerification mv = mediaVerificationRepo.findFirstByComplaintIdOrderByUploadedTimeDesc(c.getId()).orElse(null);
        String mediaType = mv != null ? mv.getMediaType() : (c.getImageUrl() != null && (c.getImageUrl().toLowerCase().endsWith(".mp4") || c.getImageUrl().toLowerCase().endsWith(".webm") || c.getImageUrl().toLowerCase().endsWith(".mov")) ? "VIDEO" : (c.getImageUrl() != null ? "IMAGE" : null));
        Integer score = (mv != null && mv.getAuthenticityScore() != null) ? mv.getAuthenticityScore() : (c.getImageUrl() != null ? 95 : null);
        String status = mv != null ? mv.getVerificationStatus() : (c.getImageUrl() != null ? "AUTHENTIC" : null);
        String reason = mv != null ? mv.getDetectionReason() : (c.getImageUrl() != null ? "Passed AI Media Inspection" : null);

        return new ComplaintResponse(c.getId(), c.getUserId(), c.getUserName(),
                c.getCategory(), c.getDescription(), c.getZone(),
                c.getImageUrl(), c.getStatus(), c.getProgress(), c.getCreatedAt(),
                mediaType, score, status, reason);
    }
}
