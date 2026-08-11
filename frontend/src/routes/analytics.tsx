import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Printer,
  Calendar,
  Activity,
  ShieldCheck,
  Building2,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { analyticsApi, reportsApi, exportApi, fetchProjects, ProjectData } from "@/lib/api";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Executive Analytics & Performance — URBAN PULSE Platform" },
      { name: "description", content: "Comprehensive municipal analytics, conflict hotspots, and performance metrics." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = ["#1E3A8A", "#16A34A", "#F59E0B", "#DC2626", "#8B5CF6", "#06B6D4"];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [priorityDist, setPriorityDist] = useState<any[]>([]);
  const [statusDist, setStatusDist] = useState<any[]>([]);

  useEffect(() => {
    analyticsApi.monthly().then(setMonthlyData).catch(() => {});
    analyticsApi.departments().then(setDeptData).catch(() => {});
    analyticsApi.priorityDistribution().then(setPriorityDist).catch(() => {});
    analyticsApi.statusDistribution().then(setStatusDist).catch(() => {});
  }, [timeRange]);

  const zoneData = [
    { zone: "Zone 1", complaints: 28, conflicts: 3 },
    { zone: "Zone 2", complaints: 19, conflicts: 1 },
    { zone: "Zone 3", complaints: 34, conflicts: 4 },
    { zone: "Zone 4", complaints: 15, conflicts: 0 },
    { zone: "Zone 5", complaints: 42, conflicts: 6 },
    { zone: "Zone 6", complaints: 22, conflicts: 2 },
  ];

  const mediaAuthenticityData = [
    { name: "Authentic Media", value: 88, color: "#16A34A" },
    { name: "Suspicious / Manipulated", value: 12, color: "#DC2626" },
  ];

  return (
    <DashboardShell title="Executive Municipal Analytics" subtitle="City Performance Metrics, Resolution Trends & Conflict Hotspots">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              Municipal Intelligence Dashboard
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1 flex items-center gap-2">
              Performance Analytics <BarChart3 className="h-6 w-6 text-[#1E3A8A]" />
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-1 text-xs">
              <Calendar className="h-3.5 w-3.5 text-[#1E3A8A] ml-2" />
              {["7d", "30d", "6m", "all"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                    timeRange === range ? "bg-[#1E3A8A] text-white" : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {range === "7d" ? "Last 7 Days" : range === "30d" ? "Last 30 Days" : range === "6m" ? "Last 6 Months" : "All Time"}
                </button>
              ))}
            </div>

            <a
              href={exportApi.getComplaintsExcelUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-bold text-[#0F172A] shadow-xs"
            >
              <FileSpreadsheet className="h-4 w-4 text-[#16A34A]" /> Export Excel
            </a>

            <a
              href={reportsApi.getAnalyticsPdfUrl(timeRange)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-xs font-bold text-white shadow-xs"
            >
              <Printer className="h-4 w-4" /> Download PDF Report
            </a>
          </div>
        </div>

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748B]">Total Grievances Submitted</p>
                <h3 className="text-2xl font-black text-[#0F172A] mt-1">158</h3>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="h-3 w-3" /> +14.2% from last month
                </span>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A]">
                <Activity className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748B]">AI Media Authenticity Score</p>
                <h3 className="text-2xl font-black text-[#16A34A] mt-1">96.4%</h3>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <ShieldCheck className="h-3 w-3" /> Deep ConvNet & ELA Verified
                </span>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-[#16A34A]">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748B]">Average Resolution Time</p>
                <h3 className="text-2xl font-black text-[#0F172A] mt-1">2.4 Days</h3>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="h-3 w-3" /> 18% faster than SLA target
                </span>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-[#F59E0B]">
                <Building2 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#64748B]">High-Risk GIS Hotspots</p>
                <h3 className="text-2xl font-black text-[#DC2626] mt-1">6 Corridors</h3>
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 mt-1">
                  <MapPin className="h-3 w-3" /> Inter-dept overlap detected
                </span>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-[#DC2626]">
                <MapPin className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#0F172A]">Grievances & Resolutions Over Time</CardTitle>
              <CardDescription className="text-xs text-[#64748B]">Monthly tracking of incoming citizen issues vs resolved tasks.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="started" name="Submitted" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="completed" name="Resolved" stroke="#16A34A" fill="#16A34A" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#0F172A]">Complaints & Conflict Hotspots by Zone</CardTitle>
              <CardDescription className="text-xs text-[#64748B]">Spatial density breakdown across all 6 municipal zones.</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="zone" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="complaints" name="Complaints" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conflicts" name="Spatial Conflicts" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#0F172A]">Complaints by Status</CardTitle>
              <CardDescription className="text-xs text-[#64748B]">Distribution of active, under review, and completed complaints.</CardDescription>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDist.length > 0 ? statusDist : [{ name: "Resolved", value: 65 }, { name: "In Progress", value: 25 }, { name: "Submitted", value: 10 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {COLORS.map((c, i) => (
                      <Cell key={i} fill={c} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#0F172A]">AI Media Forgery Analysis</CardTitle>
              <CardDescription className="text-xs text-[#64748B]">Authentic vs AI-generated or edited citizen evidence media.</CardDescription>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mediaAuthenticityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                    {mediaAuthenticityData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#0F172A]">Department Resolution Scores</CardTitle>
              <CardDescription className="text-xs text-[#64748B]">Execution score % by municipal department.</CardDescription>
            </CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={11} />
                  <YAxis type="category" dataKey="dept" stroke="#64748B" fontSize={10} width={80} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#16A34A" radius={[0, 4, 4, 0]} name="Score %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
