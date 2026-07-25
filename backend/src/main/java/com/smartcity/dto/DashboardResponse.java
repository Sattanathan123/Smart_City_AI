package com.smartcity.dto;

import java.util.List;

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

    public long getTotalProjects() { return totalProjects; }
    public void setTotalProjects(long totalProjects) { this.totalProjects = totalProjects; }
    public long getConflictProjects() { return conflictProjects; }
    public void setConflictProjects(long conflictProjects) { this.conflictProjects = conflictProjects; }
    public long getHighPriorityProjects() { return highPriorityProjects; }
    public void setHighPriorityProjects(long highPriorityProjects) { this.highPriorityProjects = highPriorityProjects; }
    public long getMediumPriorityProjects() { return mediumPriorityProjects; }
    public void setMediumPriorityProjects(long mediumPriorityProjects) { this.mediumPriorityProjects = mediumPriorityProjects; }
    public long getLowPriorityProjects() { return lowPriorityProjects; }
    public void setLowPriorityProjects(long lowPriorityProjects) { this.lowPriorityProjects = lowPriorityProjects; }
    public List<ProjectResponse> getLatestProjects() { return latestProjects; }
    public void setLatestProjects(List<ProjectResponse> latestProjects) { this.latestProjects = latestProjects; }
}
