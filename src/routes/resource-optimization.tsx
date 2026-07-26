import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import { fetchProjects, ProjectData } from "@/lib/api";

export const Route = createFileRoute("/resource-optimization")({
  head: () => ({
    meta: [
      { title: "Municipal Resource Optimization — URBAN PULSE" },
      { name: "description", content: "Smart workforce, heavy machinery, and equipment allocation system." },
    ],
  }),
  component: ResourceOptimizationPage,
});

export default function ResourceOptimizationPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((err) => console.error(err));
  }, []);

  const resourcePools = [
    { type: "Civil Engineers & Inspectors", allocated: 42, total: 50, unit: "Personnel", status: "OPTIMAL" },
    { type: "Heavy Excavators & Earthmovers", allocated: 28, total: 30, unit: "Units", status: "HIGH_UTILIZATION" },
    { type: "Utility Asphalt Pavers & Rollers", allocated: 18, total: 20, unit: "Units", status: "CRITICAL_SHORTAGE" },
    { type: "Traffic Diversion Vehicles", allocated: 35, total: 40, unit: "Vehicles", status: "OPTIMAL" },
  ];

  const optimizationCards = [
    {
      title: "Equipment Sharing Recommendation",
      target: "Zone 5 Water Pipeline & Zone 5 Road Trenching",
      suggestion: "Allocate 2 Heavy Excavators from Water Department to Road Department after Phase 1 completion.",
      saving: "Saves ₹8.5 Lakhs in equipment rental",
      type: "EQUIPMENT",
    },
    {
      title: "Workforce Re-balancing Protocol",
      target: "Zone 1 Central Flyover Structural Repair",
      suggestion: "Reassign 4 Structural Engineers from Zone 2 Completed Solar Project to Zone 1 Flyover repair team.",
      saving: "Reduces execution timeline by 8 Days",
      type: "WORKFORCE",
    },
    {
      title: "Shared Utility Trenching Protocol",
      target: "Zone 3 Underground Sewer & Electricity Cable Grid",
      suggestion: "Execute joint trenching protocol for Water & Power lines simultaneously in Sector 4.",
      saving: "Prevents double road excavation cost",
      type: "INFRASTRUCTURE",
    },
  ];

  return (
    <DashboardShell title="Resource Optimization" subtitle="Workforce & Equipment Allocation System">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-3">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              Resource Optimization & Allocation
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#111827] mt-1 flex items-center gap-2">
              Resource Allocation System <Cpu className="h-5 w-5 text-[#3B82F6]" />
            </h1>
          </div>
        </div>

        {/* Resource Utilization Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourcePools.map((r, i) => (
            <Card key={i} className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{r.type}</span>
                  <Badge
                    variant="outline"
                    className={
                      r.status === "CRITICAL_SHORTAGE"
                        ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20 text-[9px]"
                        : "bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20 text-[9px]"
                    }
                  >
                    {r.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-[#111827]">
                    {r.allocated} <span className="text-xs text-slate-400 font-medium">/ {r.total} {r.unit}</span>
                  </span>
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    {Math.round((r.allocated / r.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      r.status === "CRITICAL_SHORTAGE" ? "bg-[#DC2626]" : "bg-[#1E3A8A]"
                    }`}
                    style={{ width: `${(r.allocated / r.total) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Optimization Recommendations Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-bold tracking-tight text-[#111827] flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[#F59E0B]" /> Resource Optimization Protocols & Savings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {optimizationCards.map((c, i) => (
              <Card key={i} className="border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm">
                <CardHeader className="pb-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] bg-[#1E3A8A]/10 text-[#1E3A8A]">
                      {c.type}
                    </Badge>
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                  </div>
                  <CardTitle className="text-sm font-bold text-[#111827] mt-2">{c.title}</CardTitle>
                  <CardDescription className="text-xs font-semibold text-[#3B82F6]">{c.target}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">{c.suggestion}</p>

                  <div className="p-2.5 rounded border border-[#16A34A]/30 bg-[#16A34A]/10 text-[#16A34A] font-bold flex items-center justify-between">
                    <span>{c.saving}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <Button size="sm" className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs">
                    Apply Optimization Strategy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
