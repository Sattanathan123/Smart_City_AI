import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TriangleAlert, BrainCircuit, Loader2, ShieldCheck, ChevronDown, ChevronUp, Lightbulb, Info } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
const DEPARTMENTS = ["Road", "Water", "Electricity", "Drainage", "Waste Management"];
import { predictApi, type ProjectData, type ProjectPayload } from "@/lib/api";
import { toast } from "sonner";
import { PriorityBadge } from "./officer";

export const Route = createFileRoute("/ai-conflict")({
  head: () => ({
    meta: [
      { title: "Predictive Project Conflict Engine — URBAN PULSE" },
      {
        name: "description",
        content: "Automated cross-department conflict analysis with Explainable Risk Attribution & Recommendations.",
      },
    ],
  }),
  component: AIConflictPage,
});

const field =
  "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const defaultForm = (): ProjectPayload => ({
  projectName: "",
  department: DEPARTMENTS[0],
  projectType: "Infrastructure",
  zone: "Zone 1",
  budgetLakhs: 10,
  durationDays: 30,
  trafficDensity: 5,
  weatherRisk: 5,
  utilityDependency: 5,
  populationDensity: 5,
  criticalInfrastructure: 5,
  citizenImpact: 5,
  resourceRequirement: 5,
  contractorAvailability: 5,
  status: "PENDING",
});

function AIConflictPage() {
  const [form, setForm] = useState<ProjectPayload>(defaultForm());
  const [result, setResult] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showXai, setShowXai] = useState(true);

  const set = (key: keyof ProjectPayload, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await predictApi.predict(form);
      setResult(res);
      if (res.prediction?.conflictPrediction === "Conflict") {
        toast.warning(
          `Conflict Warning: Spatial/Resource conflict predicted for ${res.projectName}.`
        );
      } else {
        toast.success(
          `Analysis Complete: Classified as ${res.prediction?.priorityPrediction ?? "Medium"} Priority.`
        );
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const pred = result?.prediction;
  const isConflict = pred?.conflictPrediction === "Conflict";
  const confidence = pred ? Math.round(pred.conflictProbability * 100) : null;

  return (
    <DashboardShell
      title="Predictive Conflict & Explainable Attribution"
      subtitle="Modules 2 & 3 · Cross-Department Risk Attribution & Recommendations"
    >
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">
            URBAN PULSE Decision Attribution Engine & Action Recommendation
          </p>
          <p className="text-xs text-muted-foreground">
            Provides feature attribution explanations (why a project was flagged) alongside actionable mitigation recommendations.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4">Project Parameters</h2>
          <form className="space-y-3" onSubmit={handlePredict}>
            <div>
              <label className="text-sm font-medium text-foreground">Project Name</label>
              <input
                value={form.projectName}
                onChange={(e) => set("projectName", e.target.value)}
                placeholder="e.g. Water Pipeline Zone 5"
                className={field}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  className={field}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Zone</label>
                <select
                  value={form.zone}
                  onChange={(e) => set("zone", e.target.value)}
                  className={field}
                >
                  {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"].map(
                    (z) => (
                      <option key={z}>{z}</option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Project Type</label>
                <select
                  value={form.projectType}
                  onChange={(e) => set("projectType", e.target.value)}
                  className={field}
                >
                  {["Infrastructure", "Construction", "Maintenance", "Smart Infra"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Budget (Lakhs)</label>
                <input
                  type="number"
                  value={form.budgetLakhs}
                  onChange={(e) => set("budgetLakhs", Number(e.target.value))}
                  className={field}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Duration (Days)</label>
                <input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => set("durationDays", Number(e.target.value))}
                  className={field}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Traffic Density (1-10)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.trafficDensity}
                  onChange={(e) => set("trafficDensity", Number(e.target.value))}
                  className={field}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing via Machine Learning Engine…
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" /> Run Conflict & Attribution Analysis
                </>
              )}
            </Button>
          </form>
        </section>

        {/* Result & Explainable Attribution Panel */}
        <section className="space-y-4">
          {!result && !loading && (
            <Card className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center min-h-[350px]">
              <BrainCircuit className="h-12 w-12 text-primary/40 mb-3" />
              Submit project parameters to execute predictive analysis & view feature attribution.
            </Card>
          )}

          {loading && (
            <Card className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center min-h-[350px]">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
              Running Predictive Conflict Model & Priority Classifier...
            </Card>
          )}

          {result && pred && (
            <div className="space-y-4">
              {/* Main Prediction Banner */}
              <div
                className={`rounded-xl border p-4 ${isConflict ? "border-red-500/30 bg-red-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isConflict ? (
                      <TriangleAlert className="h-6 w-6 text-red-500" />
                    ) : (
                      <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    )}
                    <div>
                      <span className={`font-extrabold text-base ${isConflict ? "text-red-600" : "text-emerald-600"}`}>
                        {isConflict ? "HIGH CONFLICT RISK DETECTED" : "CLEAN INFRASTRUCTURE CORRIDOR"}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Probability Score: <span className="font-bold text-foreground">{confidence}%</span>
                      </p>
                    </div>
                  </div>
                  <PriorityBadge priority={pred.priorityPrediction} />
                </div>
              </div>

              {/* Module 2: Explainable Attribution Expandable Card */}
              <Card className="border shadow-md bg-card">
                <CardHeader className="p-4 cursor-pointer flex flex-row items-center justify-between border-b" onClick={() => setShowXai(!showXai)}>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-cyan-500" />
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">Module 2 — Explainable Feature Attribution</CardTitle>
                      <CardDescription className="text-xs">Feature attribution and spatial/temporal justification</CardDescription>
                    </div>
                  </div>
                  {showXai ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardHeader>
                {showXai && (
                  <CardContent className="p-4 space-y-2">
                    <ul className="space-y-2 text-xs">
                      {pred.explanations && pred.explanations.length > 0 ? (
                        pred.explanations.map((exp, idx) => (
                          <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted/40 border">
                            <span className="h-2 w-2 rounded-full bg-cyan-500 mt-1"></span>
                            <span className="text-foreground">{exp}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">No specific risk triggers identified.</li>
                      )}
                    </ul>
                  </CardContent>
                )}
              </Card>

              {/* Module 3: Recommendation Cards */}
              <Card className="border shadow-md bg-card">
                <CardHeader className="p-4 border-b bg-amber-500/5">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">Module 3 — Actionable Recommendations</CardTitle>
                      <CardDescription className="text-xs">Suggested actions to eliminate conflict & fast-track execution</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    {pred.recommendations && pred.recommendations.length > 0 ? (
                      pred.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg border bg-amber-500/10 border-amber-200/50 flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">💡 {rec}</span>
                          <Button size="sm" variant="outline" className="h-6 text-[10px] bg-background">
                            Apply
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">Standard schedule applies.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
