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
      { title: "AI Resource Optimization — URBAN PULSE AI" },
      { name: "description", content: "Smart workforce, heavy machinery, and equipment optimization engine." },
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
      title: "Workforce Re-balancing",
      target: "Zone 1 Central Flyover Structural Repair",
      suggestion: "Reassign 4 Structural Engineers from Zone 2 Completed Solar Project to Zone 1 Flyover repair team.",
      saving: "Reduces execution timeline by 8 Days",
      type: "WORKFORCE",
    },
    {
      title: "Shared Utility Trenching",
      target: "Zone 3 Underground Sewer & Electricity Cable Grid",
      suggestion: "Execute joint trenching protocol for Water & Power lines simultaneously in Sector 4.",
      saving: "Prevents double road excavation cost",
      type: "INFRASTRUCTURE",
    },
  ];

  return (
    <DashboardShell title="AI Resource Allocation & Optimization" subtitle="Module 6 — Smart Resource Optimization Engine">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 border-cyan-200 font-bold">
                Module 6 — Resource Optimization Engine
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground flex items-center gap-2">
              AI Resource Allocation & Optimization <Cpu className="h-6 w-6 text-cyan-500" />
            </h1>
            <p className="text-muted-foreground text-sm">
              Smart machinery, engineer, vehicle, and budget re-allocation to eliminate resource bottlenecks.
            </p>
          </div>
        </div>

        {/* Resource Utilization Pool Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourcePools.map((r, i) => (
            <Card key={i} className="border shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">{r.type}</span>
                  <Badge
                    variant="outline"
                    className={
                      r.status === "CRITICAL_SHORTAGE"
                        ? "bg-red-500/10 text-red-600 border-red-200 text-[10px]"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]"
                    }
                  >
                    {r.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-foreground">
                    {r.allocated} <span className="text-xs text-muted-foreground font-normal">/ {r.total} {r.unit}</span>
                  </span>
                  <span className="text-xs font-bold text-cyan-600">
                    {Math.round((r.allocated / r.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      r.status === "CRITICAL_SHORTAGE" ? "bg-red-500" : "bg-cyan-500"
                    }`}
                    style={{ width: `${(r.allocated / r.total) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Smart Optimization Suggestions Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" /> AI Optimization Recommendations & Savings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {optimizationCards.map((c, i) => (
              <Card key={i} className="border shadow-md hover:shadow-lg transition bg-card">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">
                      {c.type}
                    </Badge>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <CardTitle className="text-base mt-2 text-foreground">{c.title}</CardTitle>
                  <CardDescription className="text-xs font-medium text-cyan-600">{c.target}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-xs">
                  <p className="text-muted-foreground leading-relaxed">{c.suggestion}</p>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-200/50 text-emerald-700 font-semibold flex items-center justify-between">
                    <span>{c.saving}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>

                  <Button size="sm" className="w-full text-xs">
                    Apply Optimization Plan
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
