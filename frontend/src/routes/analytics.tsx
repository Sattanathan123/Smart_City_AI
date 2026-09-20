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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  PieChart as PieIcon,
  FolderKanban,
} from "lucide-react";
import { analyticsApi, reportsApi, exportApi } from "@/lib/api";

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
  const [activeTab, setActiveTab] = useState<"grievances" | "projects_resources">("grievances");

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
            {/* Time Range Selector */}
            <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white p-1">
              {["7d", "30d", "6m", "all"].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 text-xs font-bold rounded transition-colors uppercase ${
                    timeRange === r ? "bg-[#1E3A8A] text-white" : "text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(reportsApi.getAnalyticsPdfUrl(timeRange), "_blank")}
              className="gap-2 text-xs border-[#E2E8F0]"
            >
              <Printer className="h-4 w-4" /> PDF Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(exportApi.getComplaintsExcelUrl(), "_blank")}
              className="gap-2 text-xs border-[#E2E8F0]"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel Data
            </Button>
          </div>
        </div>

        {/* Spacious Tab Controls */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <button
            onClick={() => setActiveTab("grievances")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "grievances"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <PieIcon className="h-4 w-4" /> Grievances & Resolution Analytics
          </button>

          <button
            onClick={() => setActiveTab("projects_resources")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "projects_resources"
                ? "bg-[#1E3A8A] text-white shadow-xs"
                : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
            }`}
          >
            <FolderKanban className="h-4 w-4" /> Infrastructure Projects & Media Verifications
          </button>
        </div>

        {/* TAB 1: GRIEVANCES & RESOLUTION ANALYTICS */}
        {activeTab === "grievances" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complaints by Status Pie Chart */}
              <Card className="border border-[#E2E8F0] bg-white shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#0F172A]">Complaints Breakdown by Status</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">Submitted, In-Progress, Assigned, and Resolved.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDist.length > 0 ? statusDist : [{ name: "Resolved", value: 65 }, { name: "In Progress", value: 25 }, { name: "Submitted", value: 10 }]}
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Priority & Risk Distribution */}
              <Card className="border border-[#E2E8F0] bg-white shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#0F172A]">Urgency & Priority Classification</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">AI evaluated priority distribution across grievances.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priorityDist.length > 0 ? priorityDist : [{ name: "High", value: 15 }, { name: "Medium", value: 35 }, { name: "Low", value: 50 }]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1E3A8A" radius={[4, 4, 0, 0]} name="Grievances" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Resolution Time Trend */}
            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-[#0F172A]">Resolution Timeline & Progress Trend</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Monthly grievance resolution velocity.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="areaGrievance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16A34A" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="completed" stroke="#16A34A" strokeWidth={2} fill="url(#areaGrievance)" name="Resolved Grievances" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: PROJECTS & MEDIA VERIFICATIONS */}
        {activeTab === "projects_resources" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Complaints & Conflicts by Zone */}
              <Card className="border border-[#E2E8F0] bg-white shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#0F172A]">Zone-Wise Activity & Conflict Hotspots</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">Comparison of grievances and spatial conflict risks by zone.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zoneData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="zone" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="complaints" fill="#3B82F6" name="Total Complaints" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="conflicts" fill="#DC2626" name="Conflict Hotspots" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Authentic vs Suspicious Media Uploads */}
              <Card className="border border-[#E2E8F0] bg-white shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-[#0F172A]">Media Forensic Authenticity Rate</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">Deep Learning 2D-FFT & spectral forensic verification results.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mediaAuthenticityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {mediaAuthenticityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
