import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  Legend,
} from "recharts";
import {
  FolderKanban,
  TriangleAlert,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Printer,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  FileSpreadsheet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dashboardApi,
  analyticsApi,
  projectsApi,
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
      { title: "Executive Analytics — URBAN PULSE Command Center" },
      {
        name: "description",
        content: "City-wide analytics, department performance, and AI predictions.",
      },
    ],
  }),
  component: AdminAnalytics,
});

const tooltipStyle = {
  background: "#1E3A8A",
  border: "1px solid #1E293B",
  borderRadius: 6,
  color: "#FFFFFF",
  fontSize: "12px",
};

const ENTERPRISE_COLORS = ["#1E3A8A", "#3B82F6", "#16A34A", "#F59E0B", "#DC2626"];

function AdminAnalytics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [depts, setDepts] = useState<DeptData[]>([]);
  const [priorityDist, setPriorityDist] = useState<DistributionData[]>([]);
  const [statusDist, setStatusDist] = useState<DistributionData[]>([]);
  const [pending, setPending] = useState<ProjectData[]>([]);
  const [remarkMap, setRemarkMap] = useState<Record<number, string>>({});

  const [user, setUser] = useState<{ name?: string; email?: string; role?: string }>({});

  useEffect(() => {
    if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
      try {
        setUser(JSON.parse(sessionStorage.getItem("user") ?? "{}"));
      } catch {}
    }
  }, []);

  const loadPending = () =>
    projectsApi
      .getPendingApproval()
      .then(setPending)
      .catch(() => {});

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch(() => toast.error("Could not load analytics"));
    analyticsApi
      .monthly()
      .then(setMonthly)
      .catch(() => {});
    analyticsApi
      .departments()
      .then(setDepts)
      .catch(() => {});
    analyticsApi
      .priorityDistribution()
      .then(setPriorityDist)
      .catch(() => {});
    analyticsApi
      .statusDistribution()
      .then(setStatusDist)
      .catch(() => {});
    loadPending();
  }, []);

  const handleSanction = async (id: number, action: "APPROVE" | "REJECT") => {
    const remark = remarkMap[id] ?? "";
    try {
      await projectsApi.sanction(id, action, user.name ?? "Admin", remark);
      toast.success(action === "APPROVE" ? "Project Approved!" : "Project Rejected");
      loadPending();
      dashboardApi
        .get()
        .then(setData)
        .catch(() => {});
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
      `Exported By,${user.name || "Municipal Admin"}`,
      `Export Date,${new Date().toLocaleString()}`,
    ].join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `URBAN_PULSE_Executive_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const priorityWithColors = priorityDist.map((d, i) => ({
    ...d,
    color: d.color ?? ENTERPRISE_COLORS[i % ENTERPRISE_COLORS.length],
  }));

  return (
    <DashboardShell title="Executive Analytics & Sanction Dashboard" subtitle="Municipal Command Center · Performance & Report Suite">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div>
          <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
            Executive Governance Module
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-[#111827] mt-1">Municipal Analytics Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2 text-xs border-[#E5E7EB] text-[#111827]">
            <FileSpreadsheet className="h-4 w-4 text-[#16A34A]" /> Export Excel CSV
          </Button>
          <Button size="sm" onClick={handleExportPDF} className="gap-2 text-xs bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold">
            <Printer className="h-4 w-4" /> Print / PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={String(data?.totalProjects ?? "12")}
          icon={FolderKanban}
          accent="primary"
          hint="All city departments"
        />
        <StatCard
          label="Conflict Risk"
          value={String(data?.conflictProjects ?? "6")}
          icon={TriangleAlert}
          accent="destructive"
          hint="High spatial overlap"
        />
        <StatCard
          label="High Priority"
          value={String(data?.highPriorityProjects ?? "5")}
          icon={ShieldAlert}
          accent="warning"
          hint="Action required"
        />
        <StatCard
          label="Low Priority"
          value={String(data?.lowPriorityProjects ?? "3")}
          icon={TrendingUp}
          accent="success"
          hint="Scheduled execution"
        />
      </div>

      {/* Pending Approvals Section */}
      {pending.length > 0 && (
        <Card className="border border-[#F59E0B]/30 bg-[#F59E0B]/5 shadow-sm">
          <CardHeader className="pb-3 border-b border-[#F59E0B]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#F59E0B]" />
                <CardTitle className="text-base font-bold text-[#111827]">Pending Project Sanction Approval</CardTitle>
              </div>
              <Badge className="bg-[#F59E0B] text-slate-950 font-bold">{pending.length} Action Required</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="p-4 rounded-md border border-[#E5E7EB] bg-[#FFFFFF] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#111827]">{p.projectName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {p.department} Dept · {p.zone} · Budget: ₹{p.budgetLakhs}L · Duration: {p.durationDays} Days
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Sanction remark"
                    value={remarkMap[p.id] ?? ""}
                    onChange={(e) => setRemarkMap((m) => ({ ...m, [p.id]: e.target.value }))}
                    className="h-8 text-xs rounded border border-[#E5E7EB] px-2 text-[#111827] w-44"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSanction(p.id, "APPROVE")}
                    className="h-8 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white text-xs font-bold gap-1"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleSanction(p.id, "REJECT")}
                    className="h-8 text-xs font-bold gap-1"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Enterprise Recharts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Area Chart */}
        <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
          <CardHeader className="pb-2 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#3B82F6]" /> Execution Velocity (Area Chart)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="started" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} name="Projects Started" />
                <Area type="monotone" dataKey="completed" stroke="#16A34A" fill="#16A34A" fillOpacity={0.25} name="Projects Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
          <CardHeader className="pb-2 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#16A34A]" /> Project Completion Trend (Line Chart)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={2.5} name="Completed" />
                <Line type="monotone" dataKey="started" stroke="#1E3A8A" strokeWidth={2.5} name="Started" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
          <CardHeader className="pb-2 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#1E3A8A]" /> Department Efficiency % (Bar Chart)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="dept" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Completion Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
          <CardHeader className="pb-2 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-[#F59E0B]" /> Priority Distribution (Pie Chart)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-64 flex items-center justify-between">
            <div className="h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityWithColors}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {priorityWithColors.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2 text-xs">
              {priorityWithColors.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded bg-[#FFFFFF] border border-[#E5E7EB]">
                  <span className="flex items-center gap-2 font-medium text-[#111827]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: e.color }}></span> {e.name}
                  </span>
                  <span className="font-mono font-bold text-[#1E3A8A]">{String(e.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
