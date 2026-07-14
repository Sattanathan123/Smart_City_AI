package com.smartcity.service;

import com.smartcity.dto.ProjectRequest;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.entity.Project;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.ProjectRepository;
import com.smartcity.util.ProjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public ProjectResponse create(ProjectRequest req, User currentUser) {
        Project p = ProjectMapper.toEntity(req);
        p.setStatus("DRAFT");
        p.setCreatedBy(currentUser.getEmail());
        // Officer can only create for their own department
        if (currentUser.getRole() == Role.DEPARTMENT_OFFICER) {
            p.setDepartment(currentUser.getDepartment());
        }
        return ProjectMapper.toResponse(projectRepository.save(p));
    }

    public List<ProjectResponse> getAll(User currentUser) {
        if (currentUser.getRole() == Role.ADMIN) {
            return projectRepository.findAll().stream().map(ProjectMapper::toResponse).toList();
        }
        // Officer sees only their department
        return projectRepository.findByDepartmentOrderByCreatedAtDesc(currentUser.getDepartment())
                .stream().map(ProjectMapper::toResponse).toList();
    }

    public ProjectResponse getById(Long id) {
        return ProjectMapper.toResponse(findOrThrow(id));
    }

    public ProjectResponse update(Long id, ProjectRequest req, User currentUser) {
        Project existing = findOrThrow(id);
        // Officer can only update their own department projects
        if (currentUser.getRole() == Role.DEPARTMENT_OFFICER
                && !existing.getDepartment().equals(currentUser.getDepartment())) {
            throw new BadRequestException("You can only update projects in your department");
        }
        Project updated = ProjectMapper.toEntity(req);
        updated.setId(existing.getId());
        updated.setCreatedAt(existing.getCreatedAt());
        updated.setCreatedBy(existing.getCreatedBy());
        updated.setPrediction(existing.getPrediction());
        updated.setSanctionedBy(existing.getSanctionedBy());
        updated.setSanctionRemark(existing.getSanctionRemark());
        return ProjectMapper.toResponse(projectRepository.save(updated));
    }

    public void delete(Long id) {
        projectRepository.delete(findOrThrow(id));
    }

    public List<ProjectResponse> getByStatus(String status) {
        return projectRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream().map(ProjectMapper::toResponse).toList();
    }

    public ProjectResponse sanction(Long id, String action, String sanctionedBy, String remark) {
        Project p = findOrThrow(id);
        p.setStatus("APPROVE".equalsIgnoreCase(action) ? "ACTIVE" : "REJECTED");
        p.setSanctionedBy(sanctionedBy);
        p.setSanctionRemark(remark);
        return ProjectMapper.toResponse(projectRepository.save(p));
    }

    public Project findOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }
}
