package com.smartcity.controller;

import com.smartcity.dto.ProjectRequest;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.User;
import com.smartcity.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody ProjectRequest req,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.create(req, user));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getAll(user));
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.getAll(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody ProjectRequest req,
                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.update(id, req, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending-approval")
    public ResponseEntity<List<ProjectResponse>> getPendingApproval() {
        return ResponseEntity.ok(projectService.getByStatus("PENDING_APPROVAL"));
    }

    @PatchMapping("/{id}/sanction")
    public ResponseEntity<ProjectResponse> sanction(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body,
                                                     @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.sanction(
                id,
                body.get("action"),
                user.getName(),
                body.getOrDefault("remark", "")
        ));
    }
}
