package com.smartcity.service;

import com.smartcity.dto.DashboardResponse;
import com.smartcity.dto.ProjectResponse;
import com.smartcity.repository.ProjectRepository;
import com.smartcity.util.ProjectMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;

    public DashboardService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public DashboardResponse getDashboard() {
        long total = projectRepository.count();
        long conflict = projectRepository.countConflictProjects();
        long high = projectRepository.countHighPriorityProjects();
        long medium = projectRepository.countMediumPriorityProjects();
        long low = projectRepository.countLowPriorityProjects();

        List<ProjectResponse> latest = projectRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5))
                .stream()
                .map(ProjectMapper::toResponse)
                .toList();

        return new DashboardResponse(total, conflict, high, medium, low, latest);
    }
}
