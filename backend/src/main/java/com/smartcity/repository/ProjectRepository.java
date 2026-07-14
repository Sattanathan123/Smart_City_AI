package com.smartcity.repository;

import com.smartcity.entity.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT COUNT(p) FROM Project p JOIN p.prediction pr WHERE pr.conflictPrediction = 'Conflict'")
    long countConflictProjects();

    @Query("SELECT COUNT(p) FROM Project p JOIN p.prediction pr WHERE pr.priorityPrediction = 'High'")
    long countHighPriorityProjects();

    @Query("SELECT COUNT(p) FROM Project p JOIN p.prediction pr WHERE pr.priorityPrediction = 'Medium'")
    long countMediumPriorityProjects();

    @Query("SELECT COUNT(p) FROM Project p JOIN p.prediction pr WHERE pr.priorityPrediction = 'Low'")
    long countLowPriorityProjects();

    List<Project> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Project> findByStatusOrderByCreatedAtDesc(String status);

    List<Project> findByDepartmentOrderByCreatedAtDesc(String department);

    List<Project> findByCreatedByOrderByCreatedAtDesc(String createdBy);

    @Query("SELECT FUNCTION('MONTHNAME', p.createdAt), COUNT(p), SUM(CASE WHEN p.status = 'COMPLETED' THEN 1 ELSE 0 END) FROM Project p GROUP BY FUNCTION('MONTH', p.createdAt), FUNCTION('MONTHNAME', p.createdAt) ORDER BY FUNCTION('MONTH', p.createdAt)")
    List<Object[]> getMonthlyProjectStats();

    @Query("SELECT p.department, COUNT(p), SUM(CASE WHEN p.status = 'COMPLETED' THEN 1 ELSE 0 END) FROM Project p GROUP BY p.department")
    List<Object[]> getDepartmentStats();

    @Query("SELECT pr.priorityPrediction, COUNT(pr) FROM Prediction pr GROUP BY pr.priorityPrediction")
    List<Object[]> getPriorityDistribution();

    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> getStatusDistribution();
}
