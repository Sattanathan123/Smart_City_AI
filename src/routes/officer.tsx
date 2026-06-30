import { createFileRoute } from "@tanstack/react-router";
import {
  FolderKanban,
  Activity,
  TriangleAlert,
  Boxes,
  TrendingUp,
} from "lucide-react";
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
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { stats, completionData, departmentPerformance, projects } from "@/lib/data";

export const Route = createFileRoute("/officer")({
  head: () => ({
    meta: [
      { title: "Department Dashboard — SmartCity OS" },
      { name: "description", content: "Overview of projects, resources, and AI alerts for city departments." },
    ],
  }),
  component: OfficerDashboard,
});

function OfficerDashboard() {
  return (
    <DashboardShell title="Department Dashboard" subtitle="Water Department · Zone overview">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" value={String(stats.totalProjects)} icon={FolderKanban} hint="Across all zones" />
        <StatCard label="Active Projects" value={String(stats.activeProjects)} icon={Activity} accent="success" hint="Currently in progress" />
        <StatCard label="AI Conflicts Detected" value={String(stats.aiConflicts)} icon={TriangleAlert} accent="destructive" hint="Require review" />
        <StatCard label="Resources Available" value={`${stats.resourcesAvailable}%`} icon={Boxes} accent="warning" hint="Equipment & crew" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Project Activity</h2>
            <span className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" /> +14% this month
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completionData}>
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
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area type="monotone" dataKey="started" stroke="var(--color-chart-1)" fill="url(#c1)" strokeWidth={2} name="Started" />
                <Area type="monotone" dataKey="completed" stroke="var(--color-chart-2)" fill="url(#c2)" strokeWidth={2} name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Department Performance</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="dept" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={70} />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Bar dataKey="score" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-semibold text-foreground">Recent Projects</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">Project</th>
                <th className="px-3 py-2 font-medium">Department</th>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 5).map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-3 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.department}</td>
                  <td className="px-3 py-3 text-muted-foreground">{p.location}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-success/15 text-success",
    Planned: "bg-info/15 text-info",
    Completed: "bg-primary/10 text-primary",
    "On Hold": "bg-warning/15 text-warning",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}
