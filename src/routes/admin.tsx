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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { MapPinned, Droplets, ShieldAlert, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { completionData, departmentPerformance, issueDistribution } from "@/lib/data";

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

const predictions = [
  { icon: MapPinned, title: "Most Critical Zone", value: "Zone 5", desc: "Highest conflict probability & complaint density.", accent: "bg-destructive/10 text-destructive" },
  { icon: Droplets, title: "Recommended Action", value: "Prioritize drainage improvement", desc: "Predicted flooding risk during monsoon.", accent: "bg-info/15 text-info" },
  { icon: ShieldAlert, title: "Resource Forecast", value: "Excavator shortage in Aug", desc: "3 projects competing for 2 units.", accent: "bg-warning/15 text-warning" },
  { icon: Sparkles, title: "Predicted Completion", value: "+12% this quarter", desc: "On-time delivery improving across departments.", accent: "bg-success/15 text-success" },
];

function AdminAnalytics() {
  return (
    <DashboardShell title="City Analytics" subtitle="Administrator · City-wide intelligence">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {predictions.map((p) => (
          <div key={p.title} className="rounded-xl border bg-card p-5 shadow-card">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${p.accent}`}>
              <p.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {p.title}
            </p>
            <p className="mt-1 font-semibold text-foreground">{p.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Project Completion Trend</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={false} name="Completed" />
                <Line type="monotone" dataKey="started" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={false} name="Started" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground">Department Performance</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="dept" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} name="Performance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="font-semibold text-foreground">Issue Distribution</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={issueDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {issueDistribution.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {issueDistribution.map((e) => (
                <div key={e.name} className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
                  <span className="flex-1 text-sm text-foreground">{e.name}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{e.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
