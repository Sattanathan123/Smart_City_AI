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
} from "lucide-react";
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
  type DistributionData,
  type ProjectData,
} from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "URBAN PULSE AI — Analytics Dashboard & Intelligence" },
      {
        name: "description",
        content: "City-wide analytics, department performance, and AI predictions.",
      },
    ],
  }),
  component: AdminAnalytics,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  color: "var(--color-popover-foreground)",
};

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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
      `Exported By,${user.name || "Admin"}`,
      `Export Date,${new Date().toLocaleString()}`,
    ].join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UrbanPulse_Analytics_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const priorityWithColors = priorityDist.map((d, i) => ({
    ...d,
    color: d.color ?? CHART_COLORS[i % CHART_COLORS.length],
  }));

  const statusWithColors = statusDist.map((d, i) => ({
    ...d,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <DashboardShell title="URBAN PULSE AI — Analytics & Intelligence" subtitle="Module 1 & 7 · Executive Government Dashboard">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Module 1 — Aggregated Analytics & PDF/Excel Exporter
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1">Urban Pulse Infrastructure Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-1.5 text-xs">
            <Download className="h-4 w-4" /> Export Excel
          </Button>
          <Button size="sm" onClick={handleExportPDF} className="gap-1.5 text-xs">
            <Printer className="h-4 w-4" /> Print / Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={String(data?.totalProjects ?? "—")}
          icon={FolderKanban}
          hint="All city departments"
        />
        <StatCard
          label="Conflict Projects"
          value={String(data?.conflictProjects ?? "—")}
          icon={TriangleAlert}
          accent="destructive"
          hint="AI detected overlap"
        />
        <StatCard
          label="High Priority"
          value={String(data?.highPriorityProjects ?? "—")}
          icon={ShieldAlert}
          accent="warning"
          hint="Needs immediate action"
        />
        <StatCard
          label="Low Priority"
          value={String(data?.lowPriorityProjects ?? "—")}
          icon={TrendingUp}
          accent="success"
          hint="Can be scheduled"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals Panel */}
        {pending.length > 0 && (
          <div className="rounded-xl border-2 border-amber-500/40 bg-amber-500/5 p-5 shadow-card lg:col-span-2">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Clock className="h-5 w-5 text-amber-500" /> Pending Project Approvals
              <span className="ml-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-600">
                {pending.length}
              </span>
            </h2>
            <div className="mt-4 space-y-3">
              {pending.map((p) => (
                <div key={p.id} className="rounded-xl border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{p.projectName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.department} · {p.zone} · ₹{p.budgetLakhs}L · {p.durationDays} days
                      </p>
                      {p.prediction && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          AI Priority:{" "}
                          <span className="font-medium text-foreground">
                            {p.prediction.priorityPrediction}
                          </span>
                          {" · "} Conflict:{" "}
                          <span className="font-medium text-foreground">
                            {p.prediction.conflictPrediction}
                          </span>
                          {" ("}
                          {Math.round(p.prediction.conflictProbability * 100)}%{")"}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <input
                        placeholder="Remark (optional)"
                        value={remarkMap[p.id] ?? ""}
                        onChange={(e) => setRemarkMap((m) => ({ ...m, [p.id]: e.target.value }))}
                        className="rounded-lg border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring w-48"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSanction(p.id, "APPROVE")}
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleSanction(p.id, "REJECT")}
                        className="gap-1.5"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Area Chart: Monthly Infrastructure Activity */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-500" /> Area Chart — Infrastructure Execution Velocity
          </h2>
          <div className="mt-4 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="started" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Started" />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Completion Trend */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500" /> Line Chart — Project Completion Trend
          </h2>
          <div className="mt-4 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} name="Completed" />
                <Line type="monotone" dataKey="started" stroke="#3b82f6" strokeWidth={2.5} name="Started" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Department Performance */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-500" /> Bar Chart — Department Completion Efficiency (%)
          </h2>
          <div className="mt-4 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depts}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="dept" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Priority Distribution */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-amber-500" /> Pie Chart — AI Priority Share
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="h-52 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityWithColors}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {priorityWithColors.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-2 text-xs">
              {priorityWithColors.map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: e.color }} />
                  <span className="flex-1 font-medium text-foreground">{e.name}</span>
                  <span className="font-bold text-muted-foreground">{String(e.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
