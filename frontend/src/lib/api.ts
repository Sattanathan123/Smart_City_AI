const BASE = "http://localhost:8082/api";

// Helper for multipart/form-data requests (no JSON headers)
export async function requestMultipart<T>(path: string, formData: FormData): Promise<T> {
  const user = (() => {
    if (typeof window === "undefined" || typeof sessionStorage === "undefined") return {};
    try {
      return JSON.parse(sessionStorage.getItem("user") ?? "{}");
    } catch {
      return {};
    }
  })();
  const token = user?.token ?? "";
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  return res.json();
}

export async function fetchWithAuth<T>(path: string, options?: RequestInit): Promise<T> {
  const user = (() => {
    if (typeof window === "undefined" || typeof sessionStorage === "undefined") return {};
    try {
      return JSON.parse(sessionStorage.getItem("user") ?? "{}");
    } catch {
      return {};
    }
  })();
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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  return fetchWithAuth<T>(path, options);
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
  register: (body: {
    name: string;
    email: string;
    password: string;
    employeeId?: string;
    phone?: string;
    department: string;
    role: string;
  }) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

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
  explanations?: string[];
  recommendations?: string[];
  predictionTime: string;
}

export interface ProjectData extends ProjectPayload {
  id: number;
  status: string;
  createdAt: string;
  sanctionedBy: string | null;
  sanctionRemark: string | null;
  prediction: PredictionData | null;
}

export type Project = ProjectData;

export const projectsApi = {
  getAll: () => request<ProjectData[]>("/projects"),
  getById: (id: number) => request<ProjectData>(`/projects/${id}`),
  getPendingApproval: () => request<ProjectData[]>("/projects/pending-approval"),
  create: (body: ProjectPayload) =>
    request<ProjectData>("/projects", { method: "POST", body: JSON.stringify(body) }),
  update: (id: number, body: ProjectPayload) =>
    request<ProjectData>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: number) => request<void>(`/projects/${id}`, { method: "DELETE" }),
  submitForApproval: (id: number) =>
    request<ProjectData>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "PENDING_APPROVAL" }),
    }),
  sanction: (id: number, action: "APPROVE" | "REJECT", sanctionedBy: string, remark: string) =>
    request<ProjectData>(`/projects/${id}/sanction`, {
      method: "PATCH",
      body: JSON.stringify({ action, sanctionedBy, remark }),
    }),
};

export const fetchProjects = () => projectsApi.getAll();

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
  mediaType?: string | null;
  authenticityScore?: number | null;
  verificationStatus?: string | null;
  detectionReason?: string | null;
  assignedOfficer?: string | null;
}

export const complaintsApi = {
  // Create complaint with optional image or video upload using multipart/form-data
  create: (data: {
    userId: number;
    userName: string;
    category: string;
    description: string;
    zone: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('userId', String(data.userId));
    formData.append('userName', data.userName);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('zone', data.zone);
    if (data.image) {
      formData.append('image', data.image);
    }
    return requestMultipart<ComplaintData>("/complaints", formData);
  },
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
export interface MonthlyData {
  month: string;
  started: number;
  completed: number;
}
export interface DeptData {
  dept: string;
  total: number;
  completed: number;
  score: number;
}
export interface DistributionData {
  name: string;
  value: number;
  color?: string;
}

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

// ── Notifications API ────────────────────────────────────────────────────────
export interface NotificationData {
  id: number;
  recipientRole: string;
  recipientUserId?: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export const notificationsApi = {
  get: (role?: string, userId?: number) => request<NotificationData[]>(`/notifications?role=${role ?? "CITIZEN"}${userId ? `&userId=${userId}` : ""}`),
  markAsRead: (id: number) => request<void>(`/notifications/${id}/read`, { method: "PUT" }),
};

// ── Audit Logs API ───────────────────────────────────────────────────────────
export interface AuditLogData {
  id: number;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export const auditLogsApi = {
  get: (query?: string) => request<AuditLogData[]>(`/admin/audit-logs${query ? `?query=${encodeURIComponent(query)}` : ""}`),
};

// ── SHAP Explainability & GIS API ─────────────────────────────────────────────
export interface ShapFeature {
  feature: string;
  weight: number;
  percentage: number;
  impactType: "POSITIVE" | "NEGATIVE";
  description: string;
}

export interface ShapExplanationResponse {
  modelType: string;
  explanationSummary: string;
  features: ShapFeature[];
}

export interface GisConflictItem {
  conflictId: string;
  projectA: any;
  projectB: any;
  distanceMeters: number;
  overlapPercentage: number;
  conflictLat: number;
  conflictLng: number;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
}

export interface GisAnalysisResponse {
  totalProjects: number;
  totalConflicts: number;
  spatialConflicts: GisConflictItem[];
  heatmapPoints: [number, number, number][];
}

export const shapApi = {
  getExplanation: (payload: Record<string, any>) =>
    fetch("http://localhost:8000/predict/shap-explanation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json() as Promise<ShapExplanationResponse>),
};

export const gisApi = {
  getConflictAnalysis: (projects: any[]) =>
    fetch("http://localhost:8000/predict/gis-conflict-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects }),
    }).then((res) => res.json() as Promise<GisAnalysisResponse>),
};

// ── Reports & PDF Export API ──────────────────────────────────────────────────
export const reportsApi = {
  getComplaintPdfUrl: (id: number) => `${BASE}/reports/complaint/${id}/pdf`,
  getProjectPdfUrl: (id: number) => `${BASE}/reports/project/${id}/pdf`,
  getAnalyticsPdfUrl: (timeRange = "30d") => `${BASE}/reports/analytics/monthly/pdf?timeRange=${timeRange}`,
};

export const exportApi = {
  getComplaintsExcelUrl: () => `${BASE}/export/complaints`,
  getProjectsExcelUrl: () => `${BASE}/export/projects`,
  getAuditLogsExcelUrl: () => `${BASE}/export/audit-logs`,
};

// ── Weather Risk API ──────────────────────────────────────────────────────────
export interface ProjectWeatherRiskData {
  id: number;
  projectId: number;
  workabilityScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendedAction: "CONTINUE" | "CAUTION" | "REVIEW" | "DELAY" | "STOP" | "PRIORITIZE";
  delayHours: number;
  weatherSummary: string;
  riskReasons: string;
  createdAt: string;
}

export const weatherApi = {
  getCurrent: (zone = "Zone 1") => request<any>(`/weather/current?zone=${encodeURIComponent(zone)}`),
  getAllRisks: () => request<ProjectWeatherRiskData[]>("/weather/risk/projects"),
  getProjectRisk: (id: number) => request<ProjectWeatherRiskData>(`/weather/risk/project/${id}`),
  evaluateRisk: (id: number) => request<ProjectWeatherRiskData>(`/weather/risk/evaluate/${id}`, { method: "POST" }),
};

// ── Admin Users & Roles API ──────────────────────────────────────────────────
export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId?: string;
  phone?: string;
  createdAt?: string;
}

export const adminApi = {
  getUsers: () => request<UserData[]>("/admin/users"),
  createUser: (body: any) => request<UserData>("/admin/users", { method: "POST", body: JSON.stringify(body) }),
  updateUser: (id: number, body: any) => request<UserData>(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteUser: (id: number) => request<void>(`/admin/users/${id}`, { method: "DELETE" }),
};
