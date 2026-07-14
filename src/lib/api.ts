const BASE = "http://localhost:8082/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const user = (() => { try { return JSON.parse(sessionStorage.getItem("user") ?? "{}"); } catch { return {}; } })();
  const token = user?.token ?? "";
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  department: string;
  role: string;
  token: string;
  message: string;
}

export const authApi = {
  register: (body: { name: string; email: string; password: string; phone?: string; department: string; role: string }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
};

// ── Projects ──────────────────────────────────────────────────────────────────
export interface ProjectPayload {
  projectName: string;
  department: string;
  projectType: string;
  zone: string;
  budgetLakhs: number;
  durationDays: number;
  trafficDensity: number;
  weatherRisk: number;
  utilityDependency: number;
  populationDensity: number;
  criticalInfrastructure: number;
  citizenImpact: number;
  resourceRequirement: number;
  contractorAvailability: number;
  status?: string;
}

export interface PredictionData {
  id: number;
  projectId: number;
  conflictProbability: number;
  conflictPrediction: string;
  priorityPrediction: string;
  predictionTime: string;
}

export interface ProjectData extends ProjectPayload {
  id: number;
  createdAt: string;
  sanctionedBy: string | null;
  sanctionRemark: string | null;
  prediction: PredictionData | null;
}

export const projectsApi = {
  getAll: () => request<ProjectData[]>("/projects"),
  getById: (id: number) => request<ProjectData>(`/projects/${id}`),
  getPendingApproval: () => request<ProjectData[]>("/projects/pending-approval"),
  create: (body: ProjectPayload) =>
    request<ProjectData>("/projects", { method: "POST", body: JSON.stringify(body) }),
  update: (id: number, body: ProjectPayload) =>
    request<ProjectData>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: number) =>
    request<void>(`/projects/${id}`, { method: "DELETE" }),
  submitForApproval: (id: number) =>
    request<ProjectData>(`/projects/${id}`, { method: "PUT", body: JSON.stringify({ status: "PENDING_APPROVAL" }) }),
  sanction: (id: number, action: "APPROVE" | "REJECT", sanctionedBy: string, remark: string) =>
    request<ProjectData>(`/projects/${id}/sanction`, { method: "PATCH", body: JSON.stringify({ action, sanctionedBy, remark }) }),
};

// ── Predict ───────────────────────────────────────────────────────────────────
export const predictApi = {
  predict: (body: ProjectPayload) =>
    request<ProjectData>("/predict", { method: "POST", body: JSON.stringify(body) }),
};

// ── Complaints ──────────────────────────────────────────────────────────────
export interface ComplaintData {
  id: number;
  userId: number;
  userName: string;
  category: string;
  description: string;
  zone: string;
  imageUrl: string | null;
  status: string;
  progress: number;
  createdAt: string;
}

export const complaintsApi = {
  create: (body: { userId: number; userName: string; category: string; description: string; zone: string; imageUrl?: string }) =>
    request<ComplaintData>("/complaints", { method: "POST", body: JSON.stringify(body) }),
  getByUser: (userId: number) => request<ComplaintData[]>(`/complaints/user/${userId}`),
  getAll: () => request<ComplaintData[]>("/complaints"),
  getById: (id: number) => request<ComplaintData>(`/complaints/${id}`),
};

// ── Alerts ────────────────────────────────────────────────────────────────────
export interface AlertData {
  id: number;
  type: string;
  title: string;
  description: string;
  active: boolean;
  createdAt: string;
}

export const alertsApi = {
  getActive: () => request<AlertData[]>("/alerts"),
  dismiss: (id: number) => request<void>(`/alerts/${id}`, { method: "DELETE" }),
};

// ── Analytics ────────────────────────────────────────────────────────────────
export interface MonthlyData { month: string; started: number; completed: number; }
export interface DeptData { dept: string; total: number; completed: number; score: number; }
export interface DistributionData { name: string; value: number; color?: string; }

export const analyticsApi = {
  monthly: () => request<MonthlyData[]>("/analytics/monthly"),
  departments: () => request<DeptData[]>("/analytics/departments"),
  priorityDistribution: () => request<DistributionData[]>("/analytics/priority-distribution"),
  statusDistribution: () => request<DistributionData[]>("/analytics/status-distribution"),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardData {
  totalProjects: number;
  conflictProjects: number;
  highPriorityProjects: number;
  mediumPriorityProjects: number;
  lowPriorityProjects: number;
  latestProjects: ProjectData[];
}

export const dashboardApi = {
  get: () => request<DashboardData>("/dashboard"),
};
