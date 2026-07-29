package com.smartcity.repository;

import com.smartcity.entity.ProjectDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDependencyRepository extends JpaRepository<ProjectDependency, Long> {
    List<ProjectDependency> findByProjectId(Long projectId);
    List<ProjectDependency> findByDependsOnProjectId(Long dependsOnProjectId);
}
