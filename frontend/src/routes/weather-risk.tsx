import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Clock,
  RefreshCw,
  Zap,
  Search,
  Filter,
} from "lucide-react";
import { weatherApi, fetchProjects, ProjectData, ProjectWeatherRiskData } from "@/lib/api";

export const Route = createFileRoute("/weather-risk")({
  head: () => ({
    meta: [
      { title: "Weather-Aware Scheduling & Risk Engine — URBAN PULSE" },
      { name: "description", content: "AI Weather-Aware Municipal Project Scheduling, Risk Evaluation & Workability Index." },
    ],
  }),
  component: WeatherRiskPage,
});

export default function WeatherRiskPage() {
  const [selectedZone, setSelectedZone] = useState("Zone 1");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [weatherRisks, setWeatherRisks] = useState<ProjectWeatherRiskData[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluatingId, setEvaluatingId] = useState<number | null>(null);

  // Search, Filter, Sort & Pagination State
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("score_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const loadData = async () => {
    setLoading(true);
    try {
      const [w, p, r] = await Promise.all([
        weatherApi.getCurrent(selectedZone),
        fetchProjects(),
        weatherApi.getAllRisks(),
      ]);
      setWeatherData(w);
      setProjects(p ?? []);
      setWeatherRisks(r ?? []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedZone]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, riskFilter, actionFilter, sortBy, pageSize]);

  const handleEvaluate = async (projectId: number) => {
    setEvaluatingId(projectId);
    try {
      const updated = await weatherApi.evaluateRisk(projectId);
      setWeatherRisks((prev) => {
        const filtered = prev.filter((item) => item.projectId !== projectId);
        return [updated, ...filtered];
      });
    } catch {
      // Ignore
    } finally {
      setEvaluatingId(null);
    }
  };

  // Combine project with its weather risk
  const projectRiskList = projects.map((p) => {
    const risk = weatherRisks.find((r) => r.projectId === p.id);
    return {
      ...p,
      weatherRisk: risk,
    };
  });

  // Filter
  const filteredList = projectRiskList.filter((p) => {
    const r = p.weatherRisk;
    const riskLevel = r?.riskLevel ?? "LOW";
    const action = r?.recommendedAction ?? "CONTINUE";

    if (riskFilter !== "ALL" && riskLevel !== riskFilter) return false;
    if (actionFilter !== "ALL" && action !== actionFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      p.projectName.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.zone.toLowerCase().includes(q) ||
      (r?.riskReasons && r.riskReasons.toLowerCase().includes(q))
    );
  });

  // Sort
  const sortedList = [...filteredList].sort((a, b) => {
    const scoreA = a.weatherRisk?.workabilityScore ?? 75;
    const scoreB = b.weatherRisk?.workabilityScore ?? 75;
    const delayA = a.weatherRisk?.delayHours ?? 0;
    const delayB = b.weatherRisk?.delayHours ?? 0;

    if (sortBy === "score_asc") return scoreA - scoreB;
    if (sortBy === "score_desc") return scoreB - scoreA;
    if (sortBy === "delay_desc") return delayB - delayA;
    if (sortBy === "title") return a.projectName.localeCompare(b.projectName);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedList.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = sortedList.slice(startIndex, startIndex + pageSize);

  const getActionBadgeClass = (action?: string) => {
    switch (action) {
      case "CONTINUE":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      case "CAUTION":
        return "bg-amber-100 text-amber-800 border-amber-300 font-bold";
      case "REVIEW":
        return "bg-orange-100 text-orange-800 border-orange-300 font-bold";
      case "DELAY":
      case "STOP":
        return "bg-red-100 text-red-800 border-red-300 font-bold";
      case "PRIORITIZE":
        return "bg-blue-100 text-[#1E3A8A] border-blue-300 font-bold";
      default:
        return "bg-slate-100 text-slate-700 font-bold";
    }
  };

  return (
    <DashboardShell title="Weather-Aware Risk & Scheduling Engine" subtitle="AI Climate Workability Index, Operational Rules & Dynamic Delay Engine">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              AI Predictive Meteorological Engine
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1 flex items-center gap-2">
              Weather Risk Scheduling <CloudRain className="h-6 w-6 text-[#1E3A8A]" />
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-bold text-[#0F172A]"
            >
              {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6"].map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>

            <Button variant="outline" size="sm" onClick={loadData} className="gap-2 text-xs border-[#E2E8F0]">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Forecast
            </Button>
          </div>
        </div>

        {/* Live Weather Forecast Cards */}
        {weatherData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-[#E2E8F0] bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xs">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-200">Current Forecast ({weatherData.zone})</span>
                  <CloudRain className="h-5 w-5 text-blue-300" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black">{weatherData.temperature}°C</h3>
                  <span className="text-xs text-blue-200 font-bold">{weatherData.condition}</span>
                </div>
                <p className="text-[10px] text-blue-300 font-medium">30-min cached municipal meteorological feed</p>
              </CardContent>
            </Card>

            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500">Rainfall Intensity & Prob</p>
                  <h3 className="text-xl font-black text-[#0F172A] mt-1">{weatherData.rainfallMm} mm</h3>
                  <span className="text-[10px] font-bold text-blue-600">{weatherData.rainProb}% Precipitation Risk</span>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A]">
                  <Droplets className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500">Wind Velocity</p>
                  <h3 className="text-xl font-black text-[#0F172A] mt-1">{weatherData.windSpeed} km/h</h3>
                  <span className="text-[10px] font-bold text-emerald-600">Electrical Limit: 40 km/h</span>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-[#16A34A]">
                  <Wind className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#E2E8F0] bg-white shadow-xs">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500">Relative Humidity</p>
                  <h3 className="text-xl font-black text-[#0F172A] mt-1">{weatherData.humidity}%</h3>
                  <span className="text-[10px] font-bold text-slate-400">Moisture index optimal</span>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-[#F59E0B]">
                  <Thermometer className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 3-Day Forecast Cards */}
        {weatherData?.forecast3Day && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#1E3A8A]" /> 3-Day Project Scheduling Forecast
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weatherData.forecast3Day.map((d: any, i: number) => (
                <Card key={i} className="border border-[#E2E8F0] bg-white shadow-xs">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-extrabold text-xs text-[#1E3A8A]">{d.day}</span>
                      <Badge variant="outline" className="text-[9px] font-bold bg-slate-50">{d.condition}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>Temp: <b>{d.temperature}°C</b></span>
                      <span>Rain: <b className="text-blue-600">{d.rainfallMm} mm ({d.rainProb}%)</b></span>
                      <span>Wind: <b>{d.windSpeed} km/h</b></span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search, Filter, Sort & Pagination Control Toolbar */}
        <Card className="border border-[#E2E8F0] bg-white shadow-xs">
          <CardContent className="p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search title, zone, reason..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs bg-white text-[#0F172A] border-[#E2E8F0]"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5 text-[#1E3A8A]" />
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    <option value="ALL">All Risk Levels</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    <option value="ALL">All Actions</option>
                    <option value="CONTINUE">CONTINUE</option>
                    <option value="CAUTION">CAUTION</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="DELAY">DELAY</option>
                    <option value="STOP">STOP</option>
                    <option value="PRIORITIZE">PRIORITIZE</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <span className="font-medium text-slate-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    <option value="score_asc">Lowest Workability First</option>
                    <option value="score_desc">Highest Workability First</option>
                    <option value="delay_desc">Highest Delay First</option>
                    <option value="title">Project Title (A-Z)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Per Page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-bold text-[#0F172A]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Weather Risk & Scheduling Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#0F172A]">AI Weather Risk & Project Scheduling Matrix</h2>
            <Badge variant="outline" className="text-[10px] font-bold bg-blue-50 text-[#1E3A8A] border-blue-200">
              Operational Rules Enforced
            </Badge>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left text-[#0F172A]">
              <thead className="bg-[#1E3A8A] text-white uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="px-4 py-3">Project Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Workability Index</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3">AI Recommendation</th>
                  <th className="px-4 py-3">Suggested Delay</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                      No matching project weather evaluations found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((p) => {
                    const r = p.weatherRisk;
                    const score = r?.workabilityScore ?? 75;
                    const action = r?.recommendedAction ?? "CONTINUE";

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-bold text-[#0F172A]">
                          {p.projectName}
                          <span className="block text-[10px] font-normal text-slate-500">{p.department}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-600">{p.projectType}</td>
                        <td className="px-4 py-3 font-medium">{p.zone}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs">{score}/100</span>
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  score < 40 ? "bg-red-600" : score < 60 ? "bg-orange-500" : score < 80 ? "bg-amber-500" : "bg-emerald-600"
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-[9px] uppercase font-bold ${
                              r?.riskLevel === "CRITICAL" || r?.riskLevel === "HIGH"
                                ? "bg-red-50 text-red-700 border-red-300"
                                : r?.riskLevel === "MEDIUM"
                                ? "bg-amber-50 text-amber-700 border-amber-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-300"
                            }`}
                          >
                            {r?.riskLevel ?? "LOW"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={`text-[10px] ${getActionBadgeClass(action)}`}>
                            {action}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {r?.delayHours ? (
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <Clock className="h-3 w-3" /> +{r.delayHours} hrs
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold">On Schedule</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEvaluate(p.id)}
                            disabled={evaluatingId === p.id}
                            className="text-[10px] font-bold border-[#1E3A8A] text-[#1E3A8A] h-7"
                          >
                            {evaluatingId === p.id ? "Evaluating..." : "Re-evaluate"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Controls Bar */}
            <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                Showing <b>{sortedList.length === 0 ? 0 : startIndex + 1}</b> to <b>{Math.min(startIndex + pageSize, sortedList.length)}</b> of <b>{sortedList.length}</b> Weather Risk Entries
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2.5 text-xs font-bold border-[#E2E8F0]"
                >
                  &larr; Prev
                </Button>

                <span className="px-2 font-bold text-[#1E3A8A]">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-7 px-2.5 text-xs font-bold border-[#E2E8F0]"
                >
                  Next &rarr;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
