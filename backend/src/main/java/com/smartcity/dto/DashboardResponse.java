package com.smartcity.dto;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponse {
    private long totalProjects;
    private long conflictProjects;
    private long highPriorityProjects;
    private long mediumPriorityProjects;
    private long lowPriorityProjects;
    private List<ProjectResponse> latestProjects;

    public DashboardResponse(long totalProjects, long conflictProjects, long highPriorityProjects,
                              long mediumPriorityProjects, long lowPriorityProjects,
                              List<ProjectResponse> latestProjects) {
        this.totalProjects = totalProjects;
        this.conflictProjects = conflictProjects;
        this.highPriorityProjects = highPriorityProjects;
        this.mediumPriorityProjects = mediumPriorityProjects;
        this.lowPriorityProjects = lowPriorityProjects;
        this.latestProjects = latestProjects;
    }
}
