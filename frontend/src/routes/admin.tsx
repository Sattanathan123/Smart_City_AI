import { createFileRoute, Link } from "@tanstack/react-router";
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
  Building2,
  Users,
  BrainCircuit,
  Sparkles,
  Map,
  ShieldCheck,
  Cpu,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  borderRadius: 6,
  color: "#FFFFFF",
  fontSize: "12px",
};

const ENTERPRISE_COLORS = ["#1E3A8A", "#3B82F6", "#16A34A", "#F59E0B", "#DC2626"];

// Department Performance Cards Data
const DEPT_PERFORMANCE = [
  { name: "Road Infrastructure", total: 14, completed: 9, ongoing: 4, pending: 1, score: 88, conflicts: 2, satisfaction: "94%" },
  { name: "Water Supply & Sewerage", total: 12, completed: 7, ongoing: 4, pending: 1, score: 82, conflicts: 3, satisfaction: "91%" },
  { name: "Electricity & Power Grid", total: 10, completed: 8, ongoing: 2, pending: 0, score: 94, conflicts: 1, satisfaction: "96%" },
  { name: "Storm Water Drainage", total: 9, completed: 5, ongoing: 3, pending: 1, score: 76, conflicts: 2, satisfaction: "89%" },
  { name: "Solid Waste Management", total: 8, completed: 6, ongoing: 2, pending: 0, score: 90, conflicts: 0, satisfaction: "95%" },
];

// Executive AI Insights Cards
const AI_INSIGHTS = [
  {
    title: "High Spatial Overlap Risk in Zone 5",
    desc: "Metro Corridor Excavation and Water Pipeline Extension intersect at Sector 4 Junction with a 14-day schedule clash.",
    level: "CRITICAL",
    action: "Enforce Joint Trenching Protocol & Delay Road Excavation by 10 Days.",
    link: "/ai-conflict",
  },
  {
    title: "Heavy Equipment Shortage Warning",
    desc: "Zone 1 Flyover Overpass project requires 4 Heavy Excavators currently assigned to Zone 2 completed solar site.",
    level: "HIGH",
    action: "Reallocate 4 Excavators from Zone 2 to Zone 1 site immediately.",
    link: "/resource-optimization",
  },
  {
    title: "High Priority Traffic Impact Project",
    desc: "Anna Salai Arterial Drainage Relocation predicted as High Priority due to school zone proximity and monsoon risk.",
    level: "MEDIUM",
    action: "Sanction 24/7 Night Shift Execution to complete within 30 Days.",
    link: "/projects",
  },
];

// Activity Timeline Log
const RECENT_ACTIVITIES = [
  { time: "10 mins ago", title: "Project Sanctioned", desc: "Zone 3 Stormwater Channel Excavation approved by Municipal Commissioner.", icon: CheckCircle2, color: "text-[#16A34A]" },
  { time: "45 mins ago", title: "Conflict Alert Resolved", desc: "Joint Excavation Protocol agreed between Road and Water Officers in Zone 5.", icon: ShieldCheck, color: "text-[#3B82F6]" },
  { time: "2 hours ago", title: "Grievance Dispatched", desc: "Water Main Leakage Complaint #48291 assigned to Field Maintenance Team.", icon: Users, color: "text-[#F59E0B]" },
  { time: "4 hours ago", title: "Resource Re-allocated", desc: "4 Heavy Excavators reassigned to Zone 1 Central Flyover structural repair.", icon: Cpu, color: "text-[#1E3A8A]" },
];

export function AdminAnalytics() {
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
      toast.success(action === "APPROVE" ? "Project Sanctioned & Approved!" : "Project Sanction Rejected");
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
      {/* 1. TOP CONTROLS & EXECUTIVE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div>
          <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
            Executive Governance Command
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-[#111827] mt-1">Municipal Operations Overview</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2 text-xs border-[#E5E7EB] text-[#111827]">
            <FileSpreadsheet className="h-4 w-4 text-[#16A34A]" /> Export Excel CSV
          </Button>
          <Button size="sm" onClick={handleExportPDF} className="gap-2 text-xs bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold">
            <Printer className="h-4 w-4" /> Print / PDF Executive Report
          </Button>
        </div>
      </div>

      {/* 2. KPI CARDS GRID (6 Cards) */}
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

      {/* 3. PENDING PROJECT SANCTIONS WORKFLOW */}
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
                    className="h-8 text-xs rounded border border-[#E5E7EB] px-2 text-[#111827] w-48 outline-none focus:border-[#1E3A8A]"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSanction(p.id, "APPROVE")}
                    className="h-8 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white text-xs font-bold gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve Sanction
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

      {/* 4. EXECUTIVE AI DECISION SUPPORT PANEL */}
      <Card className="border border-[#1E3A8A]/20 bg-[#FFFFFF] shadow-sm">
        <CardHeader className="pb-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded bg-[#1E3A8A] text-white">
                <BrainCircuit className="h-4.5 w-4.5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-[#111827]">AI Decision Support Insights</CardTitle>
                <CardDescription className="text-xs text-slate-600 font-medium">Automated spatial conflict alerts, resource warnings, and recommended interventions.</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] font-bold text-xs">
              <Sparkles className="h-3 w-3 mr-1 text-[#3B82F6]" /> Active Decision Support
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 grid gap-4 md:grid-cols-3">
          {AI_INSIGHTS.map((ai, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    className={
                      ai.level === "CRITICAL" ? "bg-[#DC2626] text-white font-black text-[10px]" :
                      ai.level === "HIGH" ? "bg-[#F59E0B] text-slate-950 font-black text-[10px]" :
                      "bg-[#3B82F6] text-white font-black text-[10px]"
                    }
                  >
                    {ai.level} RISK
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Automated Alert</span>
                </div>
                <h4 className="font-extrabold text-xs text-[#111827]">{ai.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{ai.desc}</p>
                <div className="p-2.5 rounded bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-semibold text-[#1E3A8A]">
                  💡 <span className="font-extrabold text-[#111827]">Suggested Intervention:</span> {ai.action}
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB]">
                <Button asChild variant="outline" size="sm" className="w-full text-xs border-[#1E3A8A] text-[#1E3A8A] font-bold hover:bg-[#1E3A8A]/10 justify-between">
                  <Link to={ai.link}>
                    Review Intervention <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. DEPARTMENT PERFORMANCE CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#111827]">Inter-Department Performance Overview</h2>
          <Badge variant="outline" className="text-xs text-slate-500 font-bold">5 Active Municipal Divisions</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DEPT_PERFORMANCE.map((d) => (
            <Card key={d.name} className="border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm hover:border-[#1E3A8A] transition-all">
              <CardContent className="p-4 space-y-2 text-xs">
                <h3 className="font-extrabold text-xs text-[#1E3A8A] truncate" title={d.name}>{d.name}</h3>

                <div className="flex items-baseline justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="text-2xl font-black text-[#111827]">{d.completed} <span className="text-xs font-normal text-slate-400">/ {d.total} Works</span></span>
                  <span className="font-bold text-[#16A34A]">{d.score}%</span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                  <div className="flex justify-between"><span>Ongoing Projects:</span> <span className="font-bold text-[#111827]">{d.ongoing}</span></div>
                  <div className="flex justify-between"><span>Spatial Conflicts:</span> <span className="font-bold text-[#DC2626]">{d.conflicts}</span></div>
                  <div className="flex justify-between"><span>Citizen Satisfaction:</span> <span className="font-bold text-[#16A34A]">{d.satisfaction}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. ANALYTICS RECHARTS SUITE */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Execution Velocity Area Chart */}
        <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
          <CardHeader className="pb-2 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#3B82F6]" /> Execution Velocity (Monthly Works Started vs Completed)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="started" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.25} name="Works Started" />
                <Area type="monotone" dataKey="completed" stroke="#16A34A" fill="#16A34A" fillOpacity={0.25} name="Works Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
          <CardHeader className="pb-2 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#16A34A]" /> Project Completion & Grievance Resolution Trend
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
                <Line type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={2.5} name="Completed Projects" />
                <Line type="monotone" dataKey="started" stroke="#1E3A8A" strokeWidth={2.5} name="Initiated Projects" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
          <CardHeader className="pb-2 border-b border-[#E5E7EB]">
            <CardTitle className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#1E3A8A]" /> Department Execution Score (%)
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
              <PieIcon className="h-4 w-4 text-[#F59E0B]" /> Priority Assessment Breakdown
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

      {/* 7. RECENT REPOSITORY ACTIVITY LOG TIMELINE */}
      <Card className="border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm">
        <CardHeader className="pb-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#111827]">Recent Municipal Activity Log</h3>
            <Link to="/audit-logs" className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1">
              View Audit Trail <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((act, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded border border-[#E5E7EB] bg-[#F8FAFC] text-xs">
                <act.icon className={`h-4 w-4 mt-0.5 shrink-0 ${act.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111827]">{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                  </div>
                  <p className="text-[#64748B] font-medium mt-0.5">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
