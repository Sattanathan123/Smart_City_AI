package com.smartcity.repository;

import com.smartcity.entity.MediaVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MediaVerificationRepository extends JpaRepository<MediaVerification, UUID> {
    Optional<MediaVerification> findFirstByComplaintIdOrderByUploadedTimeDesc(Long complaintId);
}
