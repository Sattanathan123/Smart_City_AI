-- Smart City AI Database Seed Script
-- Run this in MySQL client if you wish to populate sample data manually

USE smart_city_db;

-- 1. Insert Users (Passwords encoded with BCrypt for 'Admin@123', 'Officer@123', 'Citizen@123')
INSERT INTO users (name, email, password, department, phone, role, created_at) VALUES
('Admin Officer', 'admin@smartcity.gov.in', '$2a$10$w09ZlM.46V/N9JzWq39qfe1wR9n.j/v0E.l8m0hL08k.pG8V4R20W', 'Municipal Administration', '9876543210', 'ADMIN', NOW()),
('Rajesh Kumar (Road Dept)', 'road.officer@smartcity.gov.in', '$2a$10$w09ZlM.46V/N9JzWq39qfe1wR9n.j/v0E.l8m0hL08k.pG8V4R20W', 'Road', '9876543211', 'DEPARTMENT_OFFICER', NOW()),
('Priya Sharma (Water Dept)', 'water.officer@smartcity.gov.in', '$2a$10$w09ZlM.46V/N9JzWq39qfe1wR9n.j/v0E.l8m0hL08k.pG8V4R20W', 'Water', '9876543212', 'DEPARTMENT_OFFICER', NOW()),
('Suresh Patel (Electricity Dept)', 'electricity.officer@smartcity.gov.in', '$2a$10$w09ZlM.46V/N9JzWq39qfe1wR9n.j/v0E.l8m0hL08k.pG8V4R20W', 'Electricity', '9876543213', 'DEPARTMENT_OFFICER', NOW()),
('Anita Desai', 'citizen@gmail.com', '$2a$10$w09ZlM.46V/N9JzWq39qfe1wR9n.j/v0E.l8m0hL08k.pG8V4R20W', 'Citizen', '9876543214', 'CITIZEN', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Projects
INSERT INTO projects (project_name, department, project_type, zone, budget_lakhs, duration_days, traffic_density, weather_risk, utility_dependency, population_density, critical_infrastructure, citizen_impact, resource_requirement, contractor_availability, status, created_by, sanctioned_by, sanction_remark, created_at) VALUES
('Water Pipeline Installation & Main Trenching', 'Water', 'Infrastructure', 'Zone 5', 42.0, 45, 8, 6, 9, 8, 7, 9, 8, 6, 'IN_PROGRESS', 'water.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Sanctioned for immediate monsoon prep', NOW()),
('Arterial Road Construction & Asphalt Overlay', 'Road', 'Construction', 'Zone 5', 120.0, 60, 9, 4, 8, 9, 8, 8, 9, 5, 'IN_PROGRESS', 'road.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Approved with traffic rerouting', NOW()),
('Smart LED Street Light Upgrade Grid', 'Electricity', 'Smart Infra', 'Zone 2', 18.5, 30, 4, 3, 4, 6, 5, 6, 5, 8, 'COMPLETED', 'electricity.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Completed successfully ahead of schedule', NOW()),
('Drainage Desilting & Culvert Reconstruction', 'Drainage', 'Maintenance', 'Zone 7', 9.75, 25, 5, 7, 6, 5, 6, 7, 6, 7, 'COMPLETED', 'drainage.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Finished routine maintenance', NOW()),
('Smart Waste Bins Sensor Rollout', 'Waste Management', 'Smart Infra', 'Zone 3', 31.0, 90, 6, 4, 5, 8, 6, 7, 6, 7, 'PENDING_APPROVAL', 'road.officer@smartcity.gov.in', NULL, NULL, NOW()),
('Central Flyover Structural Repair & Bearing Replacement', 'Road', 'Construction', 'Zone 1', 210.0, 120, 9, 5, 9, 9, 10, 9, 8, 4, 'APPROVED', 'road.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'High impact critical repair approved', NOW()),
('Sewage Treatment Plant Underground Expansion', 'Drainage', 'Infrastructure', 'Zone 4', 340.0, 180, 7, 6, 9, 8, 8, 8, 9, 5, 'PENDING_APPROVAL', 'drainage.officer@smartcity.gov.in', NULL, NULL, NOW()),
('Water Reservoir Cleaning & De-silting', 'Water', 'Maintenance', 'Zone 6', 6.2, 15, 3, 2, 5, 4, 5, 5, 4, 8, 'COMPLETED', 'water.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Completed spring maintenance cycle', NOW()),
('High-Voltage Substation Transformer Replacement', 'Electricity', 'Infrastructure', 'Zone 1', 85.0, 40, 7, 5, 8, 8, 9, 8, 7, 6, 'APPROVED', 'electricity.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Essential grid stability project', NOW()),
('Organic Waste Composting Facility Installation', 'Waste Management', 'Infrastructure', 'Zone 7', 52.0, 60, 5, 3, 6, 7, 6, 7, 6, 7, 'COMPLETED', 'road.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Facility operational', NOW()),
('Pedestrian Walkway & Cycle Track Construction', 'Road', 'Construction', 'Zone 3', 65.0, 50, 7, 4, 6, 7, 6, 8, 7, 6, 'PENDING_APPROVAL', 'road.officer@smartcity.gov.in', NULL, NULL, NOW()),
('Smart Water Metering & Automated Leak Detection', 'Water', 'Smart Infra', 'Zone 2', 75.0, 75, 5, 3, 7, 8, 7, 8, 6, 8, 'APPROVED', 'water.officer@smartcity.gov.in', 'admin@smartcity.gov.in', 'Approved for phase 1 implementation', NOW());

-- 3. Insert Predictions for corresponding Projects (1..12)
INSERT INTO predictions (project_id, conflict_probability, conflict_prediction, priority_prediction, prediction_time) VALUES
(1, 0.7820, 'Conflict', 'High', NOW()),
(2, 0.8140, 'Conflict', 'High', NOW()),
(3, 0.1530, 'No Conflict', 'Medium', NOW()),
(4, 0.2210, 'No Conflict', 'Low', NOW()),
(5, 0.6410, 'Conflict', 'Medium', NOW()),
(6, 0.3120, 'No Conflict', 'High', NOW()),
(7, 0.7250, 'Conflict', 'High', NOW()),
(8, 0.0890, 'No Conflict', 'Low', NOW()),
(9, 0.5890, 'Conflict', 'Medium', NOW()),
(10, 0.1800, 'No Conflict', 'Medium', NOW()),
(11, 0.6120, 'Conflict', 'High', NOW()),
(12, 0.2450, 'No Conflict', 'Medium', NOW());

-- 4. Insert Complaints
INSERT INTO complaints (user_id, user_name, category, description, zone, image_url, status, progress, created_at) VALUES
(1, 'Anita Desai', 'Water Leakage', 'Major pipeline leakage leaking onto main road causing traffic congestion.', 'Zone 5', NULL, 'IN_PROGRESS', 65, NOW()),
(1, 'Anita Desai', 'Street Light Failure', 'Multiple streetlights non-functional near sector 4 park.', 'Zone 2', NULL, 'RESOLVED', 100, NOW()),
(1, 'Anita Desai', 'Garbage Overflow', 'Uncollected waste bins causing foul smell near commercial market.', 'Zone 3', NULL, 'UNDER_REVIEW', 20, NOW()),
(1, 'Anita Desai', 'Road Damage', 'Deep potholes causing vehicle damage near Zone 1 flyover exit.', 'Zone 1', NULL, 'SUBMITTED', 0, NOW()),
(1, 'Anita Desai', 'Drainage Blockage', 'Heavy rainwater accumulation due to clogged storm drain.', 'Zone 7', NULL, 'RESOLVED', 100, NOW());

-- 5. Insert Alerts
INSERT INTO alerts (type, title, description, active, created_at) VALUES
('warning', 'Zone 5 Schedule Conflict Detected', 'Water pipeline installation and Road resurfacing overlap in Zone 5 during August. Spatial & resource conflict risk is high.', 1, NOW()),
('info', 'Monsoon Readiness Protocol Active', 'All drainage desilting and culvert maintenance projects in Zone 4 & Zone 7 must complete phase 1 by end of week.', 1, NOW()),
('success', 'Smart LED Grid Rollout Completed', 'Zone 2 Street Light Upgrade project has been successfully completed ahead of schedule with zero safety incidents.', 1, NOW());
