export const stats = {
  totalProjects: 120,
  activeProjects: 35,
  aiConflicts: 8,
  resourcesAvailable: 75,
};

export type ProjectStatus = "Active" | "Planned" | "Completed" | "On Hold";

export interface Project {
  id: string;
  name: string;
  department: string;
  location: string;
  type: string;
  status: ProjectStatus;
  budget: string;
  timeline: string;
}

export const departments = [
  "Road",
  "Water",
  "Electricity",
  "Drainage",
  "Waste Management",
];

export const projects: Project[] = [
  { id: "P-1042", name: "Water Pipeline Installation", department: "Water", location: "Zone 5", type: "Infrastructure", status: "Active", budget: "₹42,00,000", timeline: "Jul – Aug" },
  { id: "P-1043", name: "Road Construction", department: "Road", location: "Zone 5", type: "Construction", status: "Planned", budget: "₹1,20,00,000", timeline: "Aug – Sep" },
  { id: "P-1044", name: "Street Light Upgrade", department: "Electricity", location: "Zone 2", type: "Maintenance", status: "Active", budget: "₹18,50,000", timeline: "Jun – Jul" },
  { id: "P-1045", name: "Drainage Desilting", department: "Drainage", location: "Zone 7", type: "Maintenance", status: "Completed", budget: "₹9,75,000", timeline: "May – Jun" },
  { id: "P-1046", name: "Smart Waste Bins Rollout", department: "Waste Management", location: "Zone 3", type: "Smart Infra", status: "Active", budget: "₹31,00,000", timeline: "Jun – Oct" },
  { id: "P-1047", name: "Flyover Repair", department: "Road", location: "Zone 1", type: "Construction", status: "On Hold", budget: "₹2,10,00,000", timeline: "Sep – Dec" },
  { id: "P-1048", name: "Sewage Treatment Expansion", department: "Drainage", location: "Zone 4", type: "Infrastructure", status: "Planned", budget: "₹3,40,00,000", timeline: "Oct – Mar" },
  { id: "P-1049", name: "Water Reservoir Cleaning", department: "Water", location: "Zone 6", type: "Maintenance", status: "Completed", budget: "₹6,20,000", timeline: "Apr – May" },
];

export interface Complaint {
  id: string;
  category: string;
  location: string;
  status: string;
  date: string;
  resolved?: boolean;
}

export const complaints: Complaint[] = [
  { id: "C-9001", category: "Water Leakage", location: "Zone 5", status: "Assigned to Water Department", date: "2 days ago" },
  { id: "C-9002", category: "Street Light Failure", location: "Zone 2", status: "In Progress – Electricity Dept", date: "4 days ago" },
  { id: "C-9003", category: "Garbage Issue", location: "Zone 3", status: "Assigned to Waste Management", date: "1 day ago" },
  { id: "C-9004", category: "Road Damage", location: "Zone 1", status: "Under Review", date: "6 hours ago" },
];

export const resolvedUpdates: Complaint[] = [
  { id: "C-8801", category: "Drainage Problem", location: "Zone 7", status: "Resolved – Drainage Dept", date: "Yesterday", resolved: true },
  { id: "C-8802", category: "Street Light Failure", location: "Zone 6", status: "Resolved – Electricity Dept", date: "2 days ago", resolved: true },
  { id: "C-8803", category: "Garbage Issue", location: "Zone 4", status: "Resolved – Waste Management", date: "3 days ago", resolved: true },
];

export const issueCategories = [
  "Road Damage",
  "Water Leakage",
  "Street Light Failure",
  "Garbage Issue",
  "Drainage Problem",
];

export const completionData = [
  { month: "Jan", completed: 8, started: 12 },
  { month: "Feb", completed: 11, started: 9 },
  { month: "Mar", completed: 14, started: 15 },
  { month: "Apr", completed: 9, started: 7 },
  { month: "May", completed: 17, started: 13 },
  { month: "Jun", completed: 21, started: 18 },
];

export const departmentPerformance = [
  { dept: "Road", score: 78 },
  { dept: "Water", score: 88 },
  { dept: "Electricity", score: 82 },
  { dept: "Drainage", score: 69 },
  { dept: "Waste", score: 74 },
];

export const issueDistribution = [
  { name: "Road Damage", value: 34, color: "var(--color-chart-4)" },
  { name: "Water Leakage", value: 22, color: "var(--color-chart-1)" },
  { name: "Street Light", value: 18, color: "var(--color-chart-3)" },
  { name: "Garbage", value: 16, color: "var(--color-chart-2)" },
  { name: "Drainage", value: 10, color: "var(--color-chart-5)" },
];

export interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  activeProjects: number;
  citizenIssues: number;
  conflictProbability: "Low" | "Medium" | "High";
  type: "water" | "road" | "completed" | "complaint";
}

export const zones: Zone[] = [
  { id: "z1", name: "Zone 1", x: 18, y: 22, activeProjects: 2, citizenIssues: 5, conflictProbability: "Low", type: "road" },
  { id: "z2", name: "Zone 2", x: 62, y: 18, activeProjects: 1, citizenIssues: 3, conflictProbability: "Low", type: "completed" },
  { id: "z3", name: "Zone 3", x: 80, y: 40, activeProjects: 3, citizenIssues: 7, conflictProbability: "Medium", type: "complaint" },
  { id: "z4", name: "Zone 4", x: 30, y: 55, activeProjects: 2, citizenIssues: 4, conflictProbability: "Medium", type: "water" },
  { id: "z5", name: "Zone 5", x: 52, y: 60, activeProjects: 4, citizenIssues: 12, conflictProbability: "High", type: "road" },
  { id: "z6", name: "Zone 6", x: 22, y: 80, activeProjects: 1, citizenIssues: 2, conflictProbability: "Low", type: "completed" },
  { id: "z7", name: "Zone 7", x: 72, y: 78, activeProjects: 2, citizenIssues: 6, conflictProbability: "Medium", type: "water" },
];
