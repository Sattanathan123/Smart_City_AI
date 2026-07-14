import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, Activity, TriangleAlert, Boxes, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar,
} from "recharts";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { dashboardApi, analyticsApi, type DashboardData, type MonthlyData, type DeptData } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/officer")({
  head: () => ({
    meta: [
      { title: "Department Dashboard — SmartCity OS" },
      { name: "description", content: "Overview of projects, resources, and AI alerts for city departments." },
    ],
  }),
  component: OfficerDashboard,
});

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  color: "var(--color-popover-foreground)",
};

function OfficerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [depts, setDepts] = useState<DeptData[]>([]);

  useEffect(() => {
    dashboardApi.get().then(setData).catch(() => toast.error("Could not load dashboard data"));
    analyticsApi.monthly().then(setMonthly).catch(() => {});
    analyticsApi.departments().then(setDepts).catch(() => {});
  }, []);

  const latest = data?.latestProjects ?? [];

  // compute trend: compare last two months
  const trend = monthly.length >= 2
    ? monthly[monthly.length - 1].started - monthly[monthly.length - 2].started
    : null;

  return (
    <DashboardShell title="Department Dashboard" subtitle="Zone overview · Live data">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={String(data?.totalProjects ?? "—")} icon={FolderKanban} hint="Across all zones" />
        <StatCard label="High Priority" value={String(data?.highPriorityProjects ?? "—")} icon={Activity} accent="success" hint="AI predicted" />
        <StatCard label="AI Conflicts" value={String(data?.conflictProjects ?? "—")} icon={TriangleAlert} accent="destructive" hint="Require review" />
        <StatCard label="Medium Priority" value={String(data?.mediumPriorityProjects ?? "—")} icon={Boxes} accent="warning" hint="AI predicted" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Project Activity</h2>
            {trend !== null && (
              <span className={`flex items-center gap-1 text-sm ${trend >= 0 ? "text-success" : "text-destructive"}`}>
                <TrendingUp className="h-4 w-4" />
                {trend >= 0 ? "+" : ""}{trend} vs last month
              </span>
            )}
          </div>
          <div className="mt-4 h-56 sm:h-64">
            {monthly.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="started" stroke="var(--color-chart-1)" fill="url(#c1)" strokeWidth={2} name="Started" />
                  <Area type="monotone" dataKey="completed" stroke="var(--color-chart-2)" fill="url(#c2)" strokeWidth={2} name="Completed" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Department Performance</h2>
          <div className="mt-4 h-56 sm:h-64">
            {depts.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depts} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="dept" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tooltipStyle} />
                  <Bar dataKey="score" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-semibold text-foreground">Recent Projects</h2>
        {/* Desktop table */}
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Project</th>
                <th className="px-3 py-2 font-medium">Department</th>
                <th className="px-3 py-2 font-medium">Zone</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {latest.length === 0 ? (
                <tr><td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">No projects yet</td></tr>
              ) : (
                latest.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-3 py-3 font-medium text-foreground">{p.projectName}</td>
                    <td className="px-3 py-3 text-muted-foreground">{p.department}</td>
                    <td className="px-3 py-3 text-muted-foreground">{p.zone}</td>
                    <td className="px-3 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-3 py-3">{p.prediction ? <PriorityBadge priority={p.prediction.priorityPrediction} /> : <span className="text-muted-foreground text-xs">—</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {latest.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No projects yet</p>
          ) : (
            latest.map((p) => (
              <div key={p.id} className="rounded-lg border bg-background p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-foreground text-sm">{p.projectName}</p>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{p.department}</span><span>{p.zone}</span>
                  {p.prediction && <PriorityBadge priority={p.prediction.priorityPrediction} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-success/15 text-success",
    ACTIVE: "bg-success/15 text-success",
    Planned: "bg-info/15 text-info",
    PENDING: "bg-info/15 text-info",
    Completed: "bg-primary/10 text-primary",
    COMPLETED: "bg-primary/10 text-primary",
    "On Hold": "bg-warning/15 text-warning",
    ON_HOLD: "bg-warning/15 text-warning",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    High: "bg-destructive/15 text-destructive",
    Medium: "bg-warning/15 text-warning",
    Low: "bg-success/15 text-success",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[priority] ?? "bg-muted text-muted-foreground"}`}>
      {priority}
    </span>
  );
}
