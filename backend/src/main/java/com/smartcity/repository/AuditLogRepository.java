package com.smartcity.repository;

import com.smartcity.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    @Query("SELECT a FROM AuditLog a WHERE " +
           "LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.action) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.role) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> searchLogs(@Param("query") String query);
}
