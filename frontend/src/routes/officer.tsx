import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FolderKanban, Activity, TriangleAlert, Boxes, TrendingUp, Send, Plus, Clock, CheckCircle2, BarChart3, ListChecks } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  dashboardApi,
  analyticsApi,
  projectsApi,
  complaintsApi,
  type ComplaintData,
  type DashboardData,
  type MonthlyData,
  type DeptData,
  type ProjectData,
} from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/officer")({
  head: () => ({
    meta: [
      { title: "Department Officer Dashboard — URBAN PULSE Platform" },
      {
        name: "description",
        content: "Overview of infrastructure projects, project registration, and sanction submission workflows.",
      },
    ],
  }),
  component: OfficerDashboard,
});

const tooltipStyle = {
  background: "#0F172A",
  border: "1px solid #1E293B",
  borderRadius: 6,
  color: "#FFFFFF",
  fontSize: "12px",
};

type OfficerTab = "projects" | "trends" | "complaints" | "coordination";

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [depts, setDepts] = useState<DeptData[]>([]);
  const [complaintsList, setComplaintsList] = useState<ComplaintData[]>([]);
  const [submittingMap, setSubmittingMap] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<OfficerTab>("projects");

  const loadData = () => {
    dashboardApi
      .get()
      .then(setData)
      .catch(() => toast.error("Could not load dashboard data"));
    analyticsApi
      .monthly()
      .then(setMonthly)
      .catch(() => {});
    analyticsApi
      .departments()
      .then(setDepts)
      .catch(() => {});
    complaintsApi
      .getAll()
      .then(setComplaintsList)
      .catch(() => {});
  };

  useEffect(() => {
    try {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role && u.role.toUpperCase() === "CITIZEN") {
          toast.error("Department Officer Workspace requires Officer or Admin authorization.");
          navigate({ to: "/citizen" });
          return;
        }
      }
    } catch {}
    loadData();
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam === "complaints") setActiveTab("complaints");
    else if (tabParam === "coordination") setActiveTab("coordination");
    else if (tabParam === "trends") setActiveTab("trends");
    else if (tabParam === "projects") setActiveTab("projects");
  }, [window.location.search]);

  const latest = data?.latestProjects ?? [];

  const handleSubmitForSanction = async (p: ProjectData) => {
    setSubmittingMap((m) => ({ ...m, [p.id]: true }));
    try {
      await projectsApi.update(p.id, { ...p, status: "PENDING_APPROVAL" });
      toast.success(`Project "${p.projectName}" submitted to Administrator for Sanction Approval!`);
      loadData();
    } catch {
      toast.error("Failed to submit project for sanction");
    } finally {
      setSubmittingMap((m) => ({ ...m, [p.id]: false }));
    }
  };

  const trend =
    monthly.length >= 2
      ? monthly[monthly.length - 1].started - monthly[monthly.length - 2].started
      : null;

  return (
    <DashboardShell title="Department Officer Dashboard" subtitle="Project Registration & Sanction Submission Workspace">
      <div className="space-y-6">
        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              Officer Operations Workspace
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#111827] mt-1">Department Infrastructure Overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs gap-1.5 shadow-sm">
              <Link to="/projects">
                <Plus className="h-4 w-4" /> Register New Project
              </Link>
            </Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Projects"
            value={String(data?.totalProjects ?? "12")}
            icon={FolderKanban}
            hint="Across assigned zones"
          />
          <StatCard
            label="High Priority"
            value={String(data?.highPriorityProjects ?? "5")}
            icon={Activity}
            accent="success"
            hint="AI Assessed"
          />
          <StatCard
            label="Spatial Conflicts"
            value={String(data?.conflictProjects ?? "6")}
            icon={TriangleAlert}
            accent="destructive"
            hint="Requires review"
          />
          <StatCard
            label="Medium Priority"
            value={String(data?.mediumPriorityProjects ?? "4")}
            icon={Boxes}
            accent="warning"
            hint="AI Assessed"
          />
        </div>

        {/* Spacious Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "projects"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <ListChecks className="h-4 w-4" /> Department Projects & Sanctions
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "trends"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <BarChart3 className="h-4 w-4" /> Activity & Execution Trends
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "complaints"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <ListChecks className="h-4 w-4" /> Assigned Department Complaints
          </button>
          <button
            onClick={() => setActiveTab("coordination")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "coordination"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <Send className="h-4 w-4" /> Inter-Department Coordination
          </button>
        </div>

        {/* TAB 1: Department Infrastructure Projects */}
        {activeTab === "projects" && (
          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
            <CardHeader className="pb-3 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-bold text-base text-[#0F172A]">Department Infrastructure Projects</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Submit draft projects to the Municipal Administrator for sanction approval.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="text-xs border-[#1E3A8A] text-[#1E3A8A] font-bold">
                <Link to="/projects">View All Projects</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-[#0F172A]">
                  <thead className="bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10px] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-3">Project Title</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Zone</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3 text-right">Officer Sanction Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {latest.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-6 text-center text-slate-400 font-medium">
                          No projects registered yet
                        </td>
                      </tr>
                    ) : (
                      latest.map((p) => (
                        <tr key={p.id} className="hover:bg-[#F8FAFC] transition">
                          <td className="px-4 py-3 font-bold text-[#0F172A]">{p.projectName}</td>
                          <td className="px-4 py-3 font-semibold text-[#1E3A8A]">{p.department}</td>
                          <td className="px-4 py-3 text-slate-600">{p.zone}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={p.status} />
                          </td>
                          <td className="px-4 py-3">
                            {p.prediction ? (
                              <PriorityBadge priority={p.prediction.priorityPrediction} />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {p.status === "DRAFT" || p.status === "PENDING" ? (
                              <Button
                                size="sm"
                                onClick={() => handleSubmitForSanction(p)}
                                disabled={submittingMap[p.id]}
                                className="h-7 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-[11px] gap-1 shadow-sm"
                              >
                                <Send className="h-3 w-3" /> Submit for Sanction Approval
                              </Button>
                            ) : p.status === "PENDING_APPROVAL" ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                                <Clock className="h-3 w-3" /> Awaiting Admin Approval
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded border border-[#16A34A]/30">
                                <CheckCircle2 className="h-3 w-3" /> Sanctioned
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: Activity Trends */}
        {activeTab === "trends" && (
          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-bold text-sm text-[#0F172A]">Project Activity Trends</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Monthly execution and project initiation pace.</CardDescription>
              </div>
              {trend !== null && (
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}
                >
                  <TrendingUp className="h-4 w-4" />
                  {trend >= 0 ? "+" : ""}
                  {trend} vs last month
                </span>
              )}
            </CardHeader>
            <CardContent className="p-4 h-64 sm:h-72">
              {monthly.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-500 font-medium">
                  Loading activity trends...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly}>
                    <defs>
                      <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16A34A" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="started" stroke="#3B82F6" strokeWidth={2} fill="url(#c1)" name="Initiated" />
                    <Area type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={2} fill="url(#c2)" name="Completed" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 3: Assigned Department Complaints */}
        {activeTab === "complaints" && (
          <Card className="border border-[#E2E8F0] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-[#0F172A]">Assigned Department Complaints</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">
                  Civic grievances assigned for field verification and resolution.
                </CardDescription>
              </div>
              <Badge className="bg-[#1E3A8A] text-white font-bold text-xs">
                Active Department Queue
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Citizen Name</th>
                    <th className="p-3">Zone</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Media Check</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {complaintsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-400 font-medium">
                        No active complaints assigned in MySQL database.
                      </td>
                    </tr>
                  ) : (
                    complaintsList.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-slate-500">#{c.id}</td>
                        <td className="p-3 font-bold text-[#0F172A]">{c.category}</td>
                        <td className="p-3 text-slate-700">{c.userName}</td>
                        <td className="p-3 font-semibold text-slate-600">{c.zone}</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{c.description}</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-100 text-emerald-800 font-bold">
                            {c.verificationStatus || "GENUINE"} ({c.authenticityScore || 95}%)
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={c.status === "RESOLVED" ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-amber-100 text-amber-800 font-bold"}>
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: Inter-Department Coordination */}
        {activeTab === "coordination" && (
          <Card className="border border-[#E2E8F0] bg-white shadow-xs">
            <CardHeader className="pb-3 border-b border-[#E2E8F0]">
              <CardTitle className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Send className="h-4 w-4 text-[#1E3A8A]" /> Inter-Departmental Spatial & Temporal Coordination
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium">
                Review spatial conflict alerts with overlapping projects from other municipal divisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start justify-between">
                <div>
                  <Badge className="bg-amber-600 text-white font-bold text-[10px]">HIGH SPATIAL OVERLAP DETECTED</Badge>
                  <h4 className="text-sm font-bold text-[#0F172A] mt-1">Zone 5 Road Resurfacing ⚡ Water Main Trenching</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Road Department resurfacing schedule overlaps with Water Department excavation window by 3 days.
                  </p>
                </div>
                <Button size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs">
                  Send Coordination Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 font-bold",
    ACTIVE: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 font-bold",
    Planned: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 font-bold",
    PENDING: "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 font-bold",
    SANCTIONED: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 font-bold",
    Completed: "bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/30 font-bold",
    COMPLETED: "bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/30 font-bold",
    "On Hold": "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold",
    ON_HOLD: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold",
    PENDING_APPROVAL: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold",
  };
  return (
    <span className={`rounded px-2.5 py-0.5 text-[11px] ${map[status] ?? "bg-slate-100 text-slate-700 font-semibold"}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    High: "bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30 font-bold",
    Medium: "bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold",
    Low: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/30 font-bold",
  };
  return (
    <span className={`rounded px-2.5 py-0.5 text-[11px] ${map[priority] ?? "bg-slate-100 text-slate-700 font-semibold"}`}>
      {priority} Priority
    </span>
  );
}
