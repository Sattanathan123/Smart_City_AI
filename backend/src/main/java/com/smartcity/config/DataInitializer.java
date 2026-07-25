package com.smartcity.config;

import com.smartcity.entity.*;
import com.smartcity.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ComplaintRepository complaintRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           ComplaintRepository complaintRepository,
                           AlertRepository alertRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.complaintRepository = complaintRepository;
        this.alertRepository = alertRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedProjectsAndPredictions();
        seedComplaints();
        seedAlerts();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        User admin = new User();
        admin.setName("Admin Officer");
        admin.setEmail("admin@smartcity.gov.in");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setDepartment("Municipal Administration");
        admin.setPhone("9876543210");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User roadOfficer = new User();
        roadOfficer.setName("Rajesh Kumar (Road Dept)");
        roadOfficer.setEmail("road.officer@smartcity.gov.in");
        roadOfficer.setPassword(passwordEncoder.encode("Officer@123"));
        roadOfficer.setDepartment("Road");
        roadOfficer.setPhone("9876543211");
        roadOfficer.setRole(Role.DEPARTMENT_OFFICER);
        userRepository.save(roadOfficer);

        User waterOfficer = new User();
        waterOfficer.setName("Priya Sharma (Water Dept)");
        waterOfficer.setEmail("water.officer@smartcity.gov.in");
        waterOfficer.setPassword(passwordEncoder.encode("Officer@123"));
        waterOfficer.setDepartment("Water");
        waterOfficer.setPhone("9876543212");
        waterOfficer.setRole(Role.DEPARTMENT_OFFICER);
        userRepository.save(waterOfficer);

        User elecOfficer = new User();
        elecOfficer.setName("Suresh Patel (Electricity Dept)");
        elecOfficer.setEmail("electricity.officer@smartcity.gov.in");
        elecOfficer.setPassword(passwordEncoder.encode("Officer@123"));
        elecOfficer.setDepartment("Electricity");
        elecOfficer.setPhone("9876543213");
        elecOfficer.setRole(Role.DEPARTMENT_OFFICER);
        userRepository.save(elecOfficer);

        User citizen = new User();
        citizen.setName("Anita Desai");
        citizen.setEmail("citizen@gmail.com");
        citizen.setPassword(passwordEncoder.encode("Citizen@123"));
        citizen.setDepartment("Citizen");
        citizen.setPhone("9876543214");
        citizen.setRole(Role.CITIZEN);
        userRepository.save(citizen);
    }

    private void seedProjectsAndPredictions() {
        if (projectRepository.count() > 0) return;

        createProjectWithPrediction(
                "Water Pipeline Installation & Main Trenching", "Water", "Infrastructure", "Zone 5",
                42.0, 45, 8, 6, 9, 8, 7, 9, 8, 6,
                "IN_PROGRESS", "water.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Sanctioned for immediate monsoon prep",
                0.7820, "Conflict", "High"
        );

        createProjectWithPrediction(
                "Arterial Road Construction & Asphalt Overlay", "Road", "Construction", "Zone 5",
                120.0, 60, 9, 4, 8, 9, 8, 8, 9, 5,
                "IN_PROGRESS", "road.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Approved with traffic rerouting",
                0.8140, "Conflict", "High"
        );

        createProjectWithPrediction(
                "Smart LED Street Light Upgrade Grid", "Electricity", "Smart Infra", "Zone 2",
                18.5, 30, 4, 3, 4, 6, 5, 6, 5, 8,
                "COMPLETED", "electricity.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Completed successfully ahead of schedule",
                0.1530, "No Conflict", "Medium"
        );

        createProjectWithPrediction(
                "Drainage Desilting & Culvert Reconstruction", "Drainage", "Maintenance", "Zone 7",
                9.75, 25, 5, 7, 6, 5, 6, 7, 6, 7,
                "COMPLETED", "drainage.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Finished routine maintenance",
                0.2210, "No Conflict", "Low"
        );

        createProjectWithPrediction(
                "Smart Waste Bins Sensor Rollout", "Waste Management", "Smart Infra", "Zone 3",
                31.0, 90, 6, 4, 5, 8, 6, 7, 6, 7,
                "PENDING_APPROVAL", "road.officer@smartcity.gov.in", null, null,
                0.6410, "Conflict", "Medium"
        );

        createProjectWithPrediction(
                "Central Flyover Structural Repair & Bearing Replacement", "Road", "Construction", "Zone 1",
                210.0, 120, 9, 5, 9, 9, 10, 9, 8, 4,
                "APPROVED", "road.officer@smartcity.gov.in", "admin@smartcity.gov.in", "High impact critical repair approved",
                0.3120, "No Conflict", "High"
        );

        createProjectWithPrediction(
                "Sewage Treatment Plant Underground Expansion", "Drainage", "Infrastructure", "Zone 4",
                340.0, 180, 7, 6, 9, 8, 8, 8, 9, 5,
                "PENDING_APPROVAL", "drainage.officer@smartcity.gov.in", null, null,
                0.7250, "Conflict", "High"
        );

        createProjectWithPrediction(
                "Water Reservoir Cleaning & De-silting", "Water", "Maintenance", "Zone 6",
                6.2, 15, 3, 2, 5, 4, 5, 5, 4, 8,
                "COMPLETED", "water.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Completed spring maintenance cycle",
                0.0890, "No Conflict", "Low"
        );

        createProjectWithPrediction(
                "High-Voltage Substation Transformer Replacement", "Electricity", "Infrastructure", "Zone 1",
                85.0, 40, 7, 5, 8, 8, 9, 8, 7, 6,
                "APPROVED", "electricity.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Essential grid stability project",
                0.5890, "Conflict", "Medium"
        );

        createProjectWithPrediction(
                "Organic Waste Composting Facility Installation", "Waste Management", "Infrastructure", "Zone 7",
                52.0, 60, 5, 3, 6, 7, 6, 7, 6, 7,
                "COMPLETED", "road.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Facility operational",
                0.1800, "No Conflict", "Medium"
        );

        createProjectWithPrediction(
                "Pedestrian Walkway & Cycle Track Construction", "Road", "Construction", "Zone 3",
                65.0, 50, 7, 4, 6, 7, 6, 8, 7, 6,
                "PENDING_APPROVAL", "road.officer@smartcity.gov.in", null, null,
                0.6120, "Conflict", "High"
        );

        createProjectWithPrediction(
                "Smart Water Metering & Automated Leak Detection", "Water", "Smart Infra", "Zone 2",
                75.0, 75, 5, 3, 7, 8, 7, 8, 6, 8,
                "APPROVED", "water.officer@smartcity.gov.in", "admin@smartcity.gov.in", "Approved for phase 1 implementation",
                0.2450, "No Conflict", "Medium"
        );
    }

    private void createProjectWithPrediction(
            String name, String dept, String type, String zone,
            Double budget, Integer duration, Integer traffic, Integer weather,
            Integer utility, Integer pop, Integer critical, Integer citizen,
            Integer resource, Integer contractor,
            String status, String createdBy, String sanctionedBy, String remark,
            Double conflictProb, String conflictPred, String priorityPred
    ) {
        Project project = new Project();
        project.setProjectName(name);
        project.setDepartment(dept);
        project.setProjectType(type);
        project.setZone(zone);
        project.setBudgetLakhs(budget);
        project.setDurationDays(duration);
        project.setTrafficDensity(traffic);
        project.setWeatherRisk(weather);
        project.setUtilityDependency(utility);
        project.setPopulationDensity(pop);
        project.setCriticalInfrastructure(critical);
        project.setCitizenImpact(citizen);
        project.setResourceRequirement(resource);
        project.setContractorAvailability(contractor);
        project.setStatus(status);
        project.setCreatedBy(createdBy);
        project.setSanctionedBy(sanctionedBy);
        project.setSanctionRemark(remark);

        Prediction prediction = new Prediction();
        prediction.setProject(project);
        prediction.setConflictProbability(conflictProb);
        prediction.setConflictPrediction(conflictPred);
        prediction.setPriorityPrediction(priorityPred);

        project.setPrediction(prediction);
        projectRepository.save(project);
    }

    private void seedComplaints() {
        if (complaintRepository.count() > 0) return;

        createComplaint(1L, "Anita Desai", "Water Leakage", "Major pipeline leakage leaking onto main road causing traffic congestion.", "Zone 5", "IN_PROGRESS", 65);
        createComplaint(1L, "Anita Desai", "Street Light Failure", "Multiple streetlights non-functional near sector 4 park.", "Zone 2", "RESOLVED", 100);
        createComplaint(1L, "Anita Desai", "Garbage Overflow", "Uncollected waste bins causing foul smell near commercial market.", "Zone 3", "UNDER_REVIEW", 20);
        createComplaint(1L, "Anita Desai", "Road Damage", "Deep potholes causing vehicle damage near Zone 1 flyover exit.", "Zone 1", "SUBMITTED", 0);
        createComplaint(1L, "Anita Desai", "Drainage Blockage", "Heavy rainwater accumulation due to clogged storm drain.", "Zone 7", "RESOLVED", 100);
    }

    private void createComplaint(Long userId, String userName, String category, String desc, String zone, String status, Integer progress) {
        Complaint complaint = new Complaint();
        complaint.setUserId(userId);
        complaint.setUserName(userName);
        complaint.setCategory(category);
        complaint.setDescription(desc);
        complaint.setZone(zone);
        complaint.setStatus(status);
        complaint.setProgress(progress);
        complaintRepository.save(complaint);
    }

    private void seedAlerts() {
        if (alertRepository.count() > 0) return;

        createAlert("warning", "Zone 5 Schedule Conflict Detected", "Water pipeline installation and Road resurfacing overlap in Zone 5 during August. Spatial & resource conflict risk is high.");
        createAlert("info", "Monsoon Readiness Protocol Active", "All drainage desilting and culvert maintenance projects in Zone 4 & Zone 7 must complete phase 1 by end of week.");
        createAlert("success", "Smart LED Grid Rollout Completed", "Zone 2 Street Light Upgrade project has been successfully completed ahead of schedule with zero safety incidents.");
    }

    private void createAlert(String type, String title, String desc) {
        Alert alert = new Alert();
        alert.setType(type);
        alert.setTitle(title);
        alert.setDescription(desc);
        alert.setActive(true);
        alertRepository.save(alert);
    }
}
