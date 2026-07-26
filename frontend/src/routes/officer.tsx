import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Activity, TriangleAlert, Boxes, TrendingUp, Send, Plus, Clock, CheckCircle2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dashboardApi,
  analyticsApi,
  projectsApi,
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

function OfficerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [depts, setDepts] = useState<DeptData[]>([]);
  const [submittingMap, setSubmittingMap] = useState<Record<number, boolean>>({});

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
  };

  useEffect(() => {
    loadData();
  }, []);

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

      {/* Recharts Analytics Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#0F172A]">Project Activity Trends</h2>
            {trend !== null && (
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}
              >
                <TrendingUp className="h-4 w-4" />
                {trend >= 0 ? "+" : ""}
                {trend} vs last month
              </span>
            )}
          </div>
          <div className="mt-4 h-56 sm:h-64">
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
                  <Area type="monotone" dataKey="started" stroke="#3B82F6" fill="url(#c1)" strokeWidth={2} name="Started" />
                  <Area type="monotone" dataKey="completed" stroke="#16A34A" fill="url(#c2)" strokeWidth={2} name="Completed" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm">
          <h2 className="font-bold text-sm text-[#0F172A]">Department Completion Score</h2>
          <div className="mt-4 h-56 sm:h-64">
            {depts.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-slate-500 font-medium">
                Loading department metrics...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depts} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="dept" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip cursor={{ fill: "#F1F5F9" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="score" fill="#1E3A8A" radius={[0, 4, 4, 0]} name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Projects Submission & Monitoring Table */}
      <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#0F172A]">Department Infrastructure Projects</h2>
            <p className="text-xs text-slate-500 font-medium">Submit draft projects to the Municipal Administrator for sanction approval.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs border-[#1E3A8A] text-[#1E3A8A] font-bold">
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>

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
