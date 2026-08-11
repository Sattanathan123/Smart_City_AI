package com.smartcity.repository;

import com.smartcity.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.recipientRole = 'ALL' OR n.recipientRole = :role OR n.recipientUserId = :userId ORDER BY n.createdAt DESC")
    List<Notification> findForUser(@Param("role") String role, @Param("userId") Long userId);

    List<Notification> findByRecipientRoleOrderByCreatedAtDesc(String role);
}
