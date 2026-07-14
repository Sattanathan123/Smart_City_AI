import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { FolderKanban, TriangleAlert, TrendingUp, ShieldAlert, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  dashboardApi, analyticsApi, projectsApi,
  type DashboardData, type MonthlyData, type DeptData, type DistributionData, type ProjectData,
} from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Analytics — SmartCity OS" },
      { name: "description", content: "City-wide analytics, department performance, and AI predictions." },
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

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function AdminAnalytics() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [depts, setDepts] = useState<DeptData[]>([]);
  const [priorityDist, setPriorityDist] = useState<DistributionData[]>([]);
  const [statusDist, setStatusDist] = useState<DistributionData[]>([]);
  const [pending, setPending] = useState<ProjectData[]>([]);
  const [remarkMap, setRemarkMap] = useState<Record<number, string>>({});

  const user = (() => { try { return JSON.parse(sessionStorage.getItem("user") ?? "{}"); } catch { return {}; } })();

  const loadPending = () => projectsApi.getPendingApproval().then(setPending).catch(() => {});

  useEffect(() => {
    dashboardApi.get().then(setData).catch(() => toast.error("Could not load analytics"));
    analyticsApi.monthly().then(setMonthly).catch(() => {});
    analyticsApi.departments().then(setDepts).catch(() => {});
    analyticsApi.priorityDistribution().then(setPriorityDist).catch(() => {});
    analyticsApi.statusDistribution().then(setStatusDist).catch(() => {});
    loadPending();
  }, []);

  const handleSanction = async (id: number, action: "APPROVE" | "REJECT") => {
    const remark = remarkMap[id] ?? "";
    try {
      await projectsApi.sanction(id, action, user.name ?? "Admin", remark);
      toast.success(action === "APPROVE" ? "Project Approved!" : "Project Rejected");
      loadPending();
      dashboardApi.get().then(setData).catch(() => {});
    } catch { toast.error("Action failed"); }
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
    <DashboardShell title="City Analytics" subtitle="Administrator · City-wide intelligence">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={String(data?.totalProjects ?? "—")} icon={FolderKanban} hint="All departments" />
        <StatCard label="Conflict Projects" value={String(data?.conflictProjects ?? "—")} icon={TriangleAlert} accent="destructive" hint="AI detected" />
        <StatCard label="High Priority" value={String(data?.highPriorityProjects ?? "—")} icon={ShieldAlert} accent="warning" hint="Needs immediate action" />
        <StatCard label="Low Priority" value={String(data?.lowPriorityProjects ?? "—")} icon={TrendingUp} accent="success" hint="Can be scheduled" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals Panel */}
        {pending.length > 0 && (
          <div className="rounded-xl border-2 border-warning/40 bg-warning/5 p-5 shadow-card lg:col-span-2">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Clock className="h-5 w-5 text-warning" /> Pending Project Approvals
              <span className="ml-1 rounded-full bg-warning/20 px-2 py-0.5 text-xs font-bold text-warning">{pending.length}</span>
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
                          AI Priority: <span className="font-medium text-foreground">{p.prediction.priorityPrediction}</span>
                          {" · "} Conflict: <span className="font-medium text-foreground">{p.prediction.conflictPrediction}</span>
                          {" ("}{Math.round(p.prediction.conflictProbability * 100)}%{")"}  
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
                      <Button size="sm" onClick={() => handleSanction(p.id, "APPROVE")}
                        className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleSanction(p.id, "REJECT")} className="gap-1.5">
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Monthly trend */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Project Completion Trend</h2>
          <div className="mt-4 h-56 sm:h-64">
            {monthly.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={false} name="Completed" />
                  <Line type="monotone" dataKey="started" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} name="Started" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Department performance */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Department Performance</h2>
          <div className="mt-4 h-56 sm:h-64">
            {depts.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="dept" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="score" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority distribution */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Priority Distribution</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="h-52 sm:h-56">
              {priorityWithColors.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No predictions yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityWithColors} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {priorityWithColors.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex flex-col justify-center gap-2">
              {priorityWithColors.map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: e.color }} />
                  <span className="flex-1 text-sm text-foreground">{e.name}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{String(e.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status distribution */}
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Project Status Distribution</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="h-52 sm:h-56">
              {statusWithColors.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No projects yet</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusWithColors} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {statusWithColors.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex flex-col justify-center gap-2">
              {statusWithColors.map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: e.color }} />
                  <span className="flex-1 text-sm text-foreground">{e.name}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{String(e.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
