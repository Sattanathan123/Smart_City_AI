package com.smartcity.controller;

import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.User;
import com.smartcity.repository.ProjectRepository;
import com.smartcity.util.ProjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasRole('DEPARTMENT_OFFICER')")
public class OfficerController {

    private final ProjectRepository projectRepository;

    public OfficerController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(@AuthenticationPrincipal User user) {
        String dept = user.getDepartment();
        List<ProjectResponse> projects = projectRepository
                .findByDepartmentOrderByCreatedAtDesc(dept)
                .stream().map(ProjectMapper::toResponse).toList();

        long total = projects.size();
        long active = projects.stream().filter(p -> "ACTIVE".equals(p.getStatus())).count();
        long pending = projects.stream().filter(p -> "PENDING_APPROVAL".equals(p.getStatus())).count();
        long completed = projects.stream().filter(p -> "COMPLETED".equals(p.getStatus())).count();

        return ResponseEntity.ok(Map.of(
                "department", dept,
                "officerName", user.getName(),
                "totalProjects", total,
                "activeProjects", active,
                "pendingApproval", pending,
                "completedProjects", completed,
                "recentProjects", projects.stream().limit(5).toList()
        ));
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                projectRepository.findByDepartmentOrderByCreatedAtDesc(user.getDepartment())
                        .stream().map(ProjectMapper::toResponse).toList()
        );
    }
}
