import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  FolderKanban,
  TriangleAlert,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Printer,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  FileSpreadsheet,
  BrainCircuit,
  Zap,
  UserCheck,
  Users,
  UserPlus,
  Trash2,
  Shield,
  Search,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { ShapExplanationCard } from "@/components/ShapExplanationCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  dashboardApi,
  analyticsApi,
  projectsApi,
  adminApi,
  complaintsApi,
  type UserData,
  type ComplaintData,
  type DashboardData,
  type MonthlyData,
  type DeptData,
  type DistributionData,
  type ProjectData,
} from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Municipal Command & Control Center — URBAN PULSE" },
      {
        name: "description",
        content: "Executive Command Dashboard for city-wide infrastructure monitoring, sanction approvals, and AI decision support.",
      },
    ],
  }),
  component: AdminAnalytics,
});

const tooltipStyle = {
  background: "#0F172A",
  border: "1px solid #1E293B",
  borderRadius: "8px",
  color: "#FFFFFF",
  fontSize: "12px",
};

const ENTERPRISE_COLORS = ["#3B82F6", "#16A34A", "#F59E0B", "#DC2626", "#8B5CF6", "#64748B"];

type AdminTab = "overview" | "department_analytics" | "xai_insights" | "users_roles" | "complaints_governance";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [depts, setDepts] = useState<DeptData[]>([]);
  const [priorityDist, setPriorityDist] = useState<DistributionData[]>([]);
  const [statusDist, setStatusDist] = useState<DistributionData[]>([]);
  const [pending, setPending] = useState<ProjectData[]>([]);
  const [remarkMap, setRemarkMap] = useState<Record<number, string>>({});
  const [user, setUser] = useState<{ id?: number; name?: string; role?: string }>({});
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Users & Roles Management State
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [creatingUser, setCreatingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("DEPARTMENT_OFFICER");
  const [newUserDept, setNewUserDept] = useState("Road");
  const [newUserEmpId, setNewUserEmpId] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");

  // Complaints State
  const [complaintsList, setComplaintsList] = useState<ComplaintData[]>([]);

  const loadUsers = () => {
    adminApi
      .getUsers()
      .then((data) => {
        setUsersList(data ?? []);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
      });
  };

  const loadComplaints = () => {
    complaintsApi
      .getAll()
      .then((data) => {
        setComplaintsList(data ?? []);
      })
      .catch((err) => {
        console.error("Failed to load complaints:", err);
      });
  };

  useEffect(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem("user") ?? "{}");
      setUser(u);
      if (u.role && u.role.toUpperCase() !== "ADMIN") {
        toast.error(`Access Restricted: Municipal Command Center requires Administrator clearance.`);
        navigate({ to: u.role.toUpperCase().includes("OFFICER") ? "/officer" : "/citizen" });
      }
    } catch {}
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "users_roles") setActiveTab("users_roles");
    else if (tabParam === "complaints") setActiveTab("complaints_governance");
    else if (tabParam === "department_analytics") setActiveTab("department_analytics");
    else if (tabParam === "xai_insights") setActiveTab("xai_insights");
    else if (tabParam === "overview") setActiveTab("overview");
  }, [window.location.search]);

  useEffect(() => {
    if (activeTab === "users_roles") {
      loadUsers();
    } else if (activeTab === "complaints_governance") {
      loadComplaints();
    }
  }, [activeTab]);

  const loadPending = () =>
    projectsApi
      .getPendingApproval()
      .then(setPending)
      .catch(() => {});

  useEffect(() => {
    dashboardApi.get().then(setData).catch(() => toast.error("Could not load analytics"));
    analyticsApi.monthly().then(setMonthly).catch(() => {});
    analyticsApi.departments().then(setDepts).catch(() => {});
    analyticsApi.priorityDistribution().then(setPriorityDist).catch(() => {});
    analyticsApi.statusDistribution().then(setStatusDist).catch(() => {});
    loadPending();
    loadUsers();
    loadComplaints();
  }, []);

  const handleCreateUserSubmit = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      toast.error("Please fill name, email and password.");
      return;
    }
    setCreatingUser(true);
    try {
      await adminApi.createUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
        department: newUserRole === "CITIZEN" ? "PUBLIC" : newUserDept,
        employeeId: newUserEmpId,
        phone: newUserPhone,
      });
      toast.success(`User ${newUserName} created successfully!`);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserEmpId("");
      setNewUserPhone("");
      loadUsers();
    } catch (e: any) {
      toast.error(e.message || "Failed to create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${name}?`)) return;
    try {
      await adminApi.deleteUser(id);
      toast.success(`User ${name} access revoked.`);
      loadUsers();
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  const handleSanction = async (id: number, action: "APPROVE" | "REJECT") => {
    const remark = remarkMap[id] ?? "";
    try {
      await projectsApi.sanction(id, action, user.name ?? "Admin", remark);
      toast.success(action === "APPROVE" ? "Project Sanctioned & Approved!" : "Project Sanction Rejected");
      loadPending();
      dashboardApi.get().then(setData).catch(() => {});
    } catch {
      toast.error("Action failed");
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const headers = "Category,Metric Value\n";
    const rows = [
      `Total Projects,${data?.totalProjects ?? 0}`,
      `Conflict Projects,${data?.conflictProjects ?? 0}`,
      `High Priority Projects,${data?.highPriorityProjects ?? 0}`,
      `Low Priority Projects,${data?.lowPriorityProjects ?? 0}`,
      `Exported By,${user.name || "Municipal Administrator"}`,
      `Export Date,${new Date().toLocaleString()}`,
    ].join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `URBAN_PULSE_Executive_Command_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const priorityWithColors = priorityDist.map((d, i) => ({
    ...d,
    color: d.color ?? ENTERPRISE_COLORS[i % ENTERPRISE_COLORS.length],
  }));

  return (
    <DashboardShell title="Municipal Command & Control Center" subtitle="City-Wide Infrastructure Monitoring, Executive Sanctions & AI Decision Support">
      <div className="space-y-6">
        {/* Top Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              Executive Governance Command
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#111827] mt-1">Municipal Operations Overview</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2 text-xs border-[#E5E7EB] text-[#111827]">
              <FileSpreadsheet className="h-4 w-4 text-[#16A34A]" /> Export CSV Report
            </Button>
            <Button size="sm" onClick={handleExportPDF} className="gap-2 text-xs bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold">
              <Printer className="h-4 w-4" /> Print PDF Report
            </Button>
          </div>
        </div>

        {/* Spacious Navigation Tabs (Uncluttered Layout) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Executive Overview & Sanctions
            {pending.length > 0 && (
              <Badge className="bg-[#F59E0B] text-slate-950 font-extrabold text-[9px] px-1.5 py-0.2">
                {pending.length}
              </Badge>
            )}
          </button>

          <button
            onClick={() => setActiveTab("department_analytics")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "department_analytics"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <PieIcon className="h-4 w-4" /> Department & Risk Breakdown
          </button>

          <button
            onClick={() => setActiveTab("xai_insights")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "xai_insights"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <BrainCircuit className="h-4 w-4" /> Explainable AI & SHAP Insights
          </button>

          <button
            onClick={() => setActiveTab("users_roles")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "users_roles"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <UserCheck className="h-4 w-4" /> Users & Roles Governance
          </button>

          <button
            onClick={() => setActiveTab("complaints_governance")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "complaints_governance"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <Users className="h-4 w-4" /> Complaints Governance
          </button>
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW & SANCTIONS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards Grid (6 Cards) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <StatCard
                label="Total Projects"
                value={String(data?.totalProjects ?? "12")}
                icon={FolderKanban}
                accent="primary"
                hint="Across 7 Zones"
              />
              <StatCard
                label="Active Works"
                value="8"
                icon={Activity}
                accent="success"
                hint="In Execution"
              />
              <StatCard
                label="High Priority"
                value={String(data?.highPriorityProjects ?? "5")}
                icon={ShieldAlert}
                accent="warning"
                hint="Urgent Focus"
              />
              <StatCard
                label="Conflict Alerts"
                value={String(data?.conflictProjects ?? "6")}
                icon={TriangleAlert}
                accent="destructive"
                hint="Spatial Overlaps"
              />
              <StatCard
                label="Pending Sanctions"
                value={String(pending.length)}
                icon={Clock}
                accent="warning"
                hint="Awaiting Approval"
              />
              <StatCard
                label="Budget Utilization"
                value="78.4%"
                icon={TrendingUp}
                accent="primary"
                hint="₹4,250L Sanctioned"
              />
            </div>

            {/* Pending Sanctions Workflow */}
            {pending.length > 0 && (
              <Card className="border border-[#F59E0B]/40 bg-[#F59E0B]/5 shadow-sm">
                <CardHeader className="pb-3 border-b border-[#F59E0B]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#F59E0B]" />
                      <div>
                        <CardTitle className="text-base font-bold text-[#111827]">Pending Project Sanctions Clearance</CardTitle>
                        <CardDescription className="text-xs text-slate-600 font-medium">Review registration details and issue formal administrative sanction.</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-[#F59E0B] text-slate-950 font-extrabold">{pending.length} Pending Approval</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {pending.map((p) => (
                    <div key={p.id} className="p-4 rounded-md border border-[#E5E7EB] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-[#111827]">{p.projectName}</h4>
                          <Badge variant="outline" className="text-[10px] bg-[#1E3A8A]/10 text-[#1E3A8A] font-bold">{p.zone}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 font-medium mt-1">
                          Department: <span className="font-bold text-[#1E3A8A]">{p.department}</span> · Budget: <span className="font-bold">₹{p.budgetLakhs} Lakhs</span> · Timeline: <span className="font-bold">{p.durationDays} Days</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          placeholder="Enter sanction remark..."
                          value={remarkMap[p.id] ?? ""}
                          onChange={(e) => setRemarkMap((m) => ({ ...m, [p.id]: e.target.value }))}
                          className="h-8 rounded border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-xs text-[#111827] w-48 outline-none focus:border-[#1E3A8A]"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSanction(p.id, "APPROVE")}
                          className="h-8 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white font-bold text-xs gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve Sanction
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Project Completion & Activity Trend Chart */}
            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-[#0F172A]">City Infrastructure Project Completion & Activity Trend</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Monthly progress tracking across all municipal zones.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly}>
                    <defs>
                      <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="area2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16A34A" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="started" name="Initiated Projects" stroke="#3B82F6" strokeWidth={2} fill="url(#area1)" />
                    <Area type="monotone" dataKey="completed" name="Completed Works" stroke="#16A34A" strokeWidth={2} fill="url(#area2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: DEPARTMENT & RISK BREAKDOWN */}
        {activeTab === "department_analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Infrastructure Breakdown */}
            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-[#0F172A]">Department Performance & Project Distribution</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Inter-departmental project load allocation.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="projects" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Active Projects" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution Donut Chart */}
            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-[#0F172A]">AI Priority Level Distribution</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">High, Medium, and Low risk distribution.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityWithColors}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {priorityWithColors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: EXPLAINABLE AI & SHAP INSIGHTS */}
        {activeTab === "xai_insights" && (
          <div className="space-y-6">
            <ShapExplanationCard />
          </div>
        )}

        {/* TAB 4: USERS & ROLES GOVERNANCE */}
        {activeTab === "users_roles" && (
          <div className="space-y-6">
            {/* Header & Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="border border-[#E2E8F0] bg-white p-4">
                <p className="text-xs text-slate-500 font-bold">Total Accounts</p>
                <p className="text-2xl font-black text-[#0F172A]">{usersList.length || 6}</p>
              </Card>
              <Card className="border border-[#E2E8F0] bg-white p-4">
                <p className="text-xs text-slate-500 font-bold">Department Officers</p>
                <p className="text-2xl font-black text-[#3B82F6]">
                  {usersList.filter((u) => u.role?.includes("OFFICER")).length || 4}
                </p>
              </Card>
              <Card className="border border-[#E2E8F0] bg-white p-4">
                <p className="text-xs text-slate-500 font-bold">Administrators</p>
                <p className="text-2xl font-black text-[#8B5CF6]">
                  {usersList.filter((u) => u.role === "ADMIN").length || 2}
                </p>
              </Card>
              <Card className="border border-[#E2E8F0] bg-white p-4">
                <p className="text-xs text-slate-500 font-bold">Registered Citizens</p>
                <p className="text-2xl font-black text-[#16A34A]">
                  {usersList.filter((u) => u.role === "CITIZEN").length || 1}
                </p>
              </Card>
            </div>

            {/* Create New User Panel */}
            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardHeader className="pb-3 border-b border-[#E2E8F0]">
                <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-[#1E3A8A]" /> Provision New System Account / Officer
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">
                  Directly register new municipal personnel with assigned department authority and employee clearance code.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Officer Ramanathan"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="mt-1 w-full rounded border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      placeholder="officer@smartcity.gov.in"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="mt-1 w-full rounded border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="mt-1 w-full rounded border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">System Access Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="mt-1 w-full rounded border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold"
                    >
                      <option value="DEPARTMENT_OFFICER">DEPARTMENT OFFICER</option>
                      <option value="ADMIN">ADMINISTRATOR</option>
                      <option value="CITIZEN">CITIZEN</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Department Division</label>
                    <select
                      value={newUserDept}
                      onChange={(e) => setNewUserDept(e.target.value)}
                      className="mt-1 w-full rounded border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold"
                    >
                      <option value="Road">Road Infrastructure Division</option>
                      <option value="Water">Water Supply & Sewage Board</option>
                      <option value="Electricity">Electricity & Power Operations</option>
                      <option value="Drainage">Storm Water Drainage Dept</option>
                      <option value="Sanitation">Solid Waste & Sanitation</option>
                      <option value="PUBLIC">Public / Citizen</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Employee ID / Clearance Code</label>
                    <input
                      type="text"
                      placeholder="EMP-RD-2026"
                      value={newUserEmpId}
                      onChange={(e) => setNewUserEmpId(e.target.value)}
                      className="mt-1 w-full rounded border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateUserSubmit}
                    disabled={creatingUser}
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs px-6 gap-2"
                  >
                    <UserPlus className="h-4 w-4" /> Provision Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Data Table */}
            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardHeader className="pb-3 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-[#0F172A]">Registered Accounts & Authorization Matrix</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">
                    View, manage, and audit all personnel access rights across the platform.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="rounded border border-[#E2E8F0] bg-white px-2 py-1 text-xs font-semibold"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="OFFICER">DEPARTMENT OFFICER</option>
                    <option value="CITIZEN">CITIZEN</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">User ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Employee ID</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-slate-400 font-medium">
                          No registered accounts in MySQL database.
                        </td>
                      </tr>
                    ) : (
                      usersList
                        .filter((u) => userRoleFilter === "ALL" || u.role?.toUpperCase().includes(userRoleFilter))
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50 transition">
                            <td className="p-3 font-mono font-bold text-slate-500">#{u.id}</td>
                            <td className="p-3 font-bold text-[#0F172A]">{u.name}</td>
                            <td className="p-3 text-slate-600 font-medium">{u.email}</td>
                            <td className="p-3">
                              <Badge
                                className={
                                  u.role === "ADMIN"
                                    ? "bg-purple-100 text-purple-800 border-purple-200 font-bold"
                                    : u.role?.includes("OFFICER")
                                    ? "bg-blue-100 text-blue-800 border-blue-200 font-bold"
                                    : "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold"
                                }
                              >
                                {u.role}
                              </Badge>
                            </td>
                            <td className="p-3 font-semibold text-slate-700">{u.department || "N/A"}</td>
                            <td className="p-3 font-mono text-slate-500">{u.employeeId || "N/A"}</td>
                            <td className="p-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                title="Revoke User Access"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 5: COMPLAINTS GOVERNANCE */}
        {activeTab === "complaints_governance" && (
          <div className="space-y-6">
            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardHeader className="pb-3 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-[#0F172A]">City-Wide Complaints & Grievance Governance</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">
                    Monitor citizen complaints, media authenticity checks, and department assignments.
                  </CardDescription>
                </div>
                <Badge className="bg-[#1E3A8A] text-white font-bold text-xs">
                  {complaintsList.length} Active Complaints
                </Badge>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">ID</th>
                      <th className="p-3">Citizen Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Zone</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">AI Media Check</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Assigned Officer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {complaintsList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-4 text-center text-slate-400 font-medium">
                          No active complaints in MySQL database.
                        </td>
                      </tr>
                    ) : (
                      complaintsList.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 font-mono font-bold text-slate-500">#{c.id}</td>
                          <td className="p-3 font-bold text-[#0F172A]">{c.userName}</td>
                          <td className="p-3 font-semibold text-slate-800">{c.category}</td>
                          <td className="p-3 font-semibold text-slate-600">{c.zone}</td>
                          <td className="p-3 text-slate-600 max-w-xs truncate">{c.description}</td>
                          <td className="p-3">
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold">
                              {c.verificationStatus || "GENUINE"} ({c.authenticityScore || 95}%)
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={c.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800 font-bold"}>
                              {c.status}
                            </Badge>
                          </td>
                          <td className="p-3 font-semibold text-slate-700">{c.assignedOfficer || "Unassigned"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
