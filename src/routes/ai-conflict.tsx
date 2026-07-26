import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TriangleAlert, BrainCircuit, Loader2, ShieldCheck, ChevronDown, ChevronUp, Lightbulb, Info } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { predictApi, type ProjectData, type ProjectPayload } from "@/lib/api";
import { toast } from "sonner";
import { PriorityBadge } from "./officer";

export const Route = createFileRoute("/ai-conflict")({
  head: () => ({
    meta: [
      { title: "Predictive Conflict Analysis — URBAN PULSE Platform" },
      {
        name: "description",
        content: "Automated cross-department conflict analysis with Explainable Risk Attribution & Recommendations.",
      },
    ],
  }),
  component: AIConflictPage,
});

const DEPARTMENTS = ["Road", "Water", "Electricity", "Drainage", "Waste Management"];
const fieldClass =
  "mt-1 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#0F172A] outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]";

const defaultForm = (): ProjectPayload => ({
  projectName: "",
  department: DEPARTMENTS[0],
  projectType: "Infrastructure",
  zone: "Zone 1",
  budgetLakhs: 120,
  durationDays: 45,
  trafficDensity: 8,
  weatherRisk: 7,
  utilityDependency: 9,
  populationDensity: 8,
  criticalInfrastructure: 9,
  citizenImpact: 8,
  resourceRequirement: 8,
  contractorAvailability: 4,
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
          `Conflict Risk Flagged: Spatial/Resource overlap predicted for ${res.projectName}.`
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
      title="Predictive Conflict & Risk Attribution Engine"
      subtitle="Modules 2 & 3 · Cross-Department Risk Attribution & Action Accordions"
    >
      <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/5 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#1E3A8A] text-white">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-[#0F172A]">
            URBAN PULSE Explainable Risk Attribution & Mitigation Strategy Engine
          </p>
          <p className="text-xs text-slate-600 font-medium">
            Evaluates cross-department spatial dependencies, timeline overlaps, and resource bottlenecks to recommend scheduling interventions.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form Panel */}
        <section className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm">
          <h2 className="font-bold text-sm text-[#0F172A] mb-3">Project Execution Parameters</h2>
          <form className="space-y-3" onSubmit={handlePredict}>
            <div>
              <label className="text-xs font-bold text-[#0F172A]">Project Name *</label>
              <input
                value={form.projectName}
                onChange={(e) => set("projectName", e.target.value)}
                placeholder="e.g. Zone 5 Arterial Water Main & Road Overlay"
                className={fieldClass}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  className={fieldClass}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d} className="bg-white text-[#0F172A]">{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Zone</label>
                <select
                  value={form.zone}
                  onChange={(e) => set("zone", e.target.value)}
                  className={fieldClass}
                >
                  {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"].map(
                    (z) => (
                      <option key={z} value={z} className="bg-white text-[#0F172A]">{z}</option>
                    ),
                  )}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Project Type</label>
                <select
                  value={form.projectType}
                  onChange={(e) => set("projectType", e.target.value)}
                  className={fieldClass}
                >
                  {["Infrastructure", "Construction", "Maintenance", "Smart Infra"].map((t) => (
                    <option key={t} value={t} className="bg-white text-[#0F172A]">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Budget (₹ Lakhs)</label>
                <input
                  type="number"
                  value={form.budgetLakhs}
                  onChange={(e) => set("budgetLakhs", Number(e.target.value))}
                  className={fieldClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Duration (Days)</label>
                <input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => set("durationDays", Number(e.target.value))}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0F172A]">
                  Traffic Density Index (1-10)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.trafficDensity}
                  onChange={(e) => set("trafficDensity", Number(e.target.value))}
                  className={fieldClass}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Evaluating via XGBoost Machine Learning Engine…
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" /> Run Predictive Analysis & Attribution
                </>
              )}
            </Button>
          </form>
        </section>

        {/* Prediction Results & Accordions */}
        <section className="space-y-4">
          {!result && !loading && (
            <Card className="p-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center min-h-[350px] border-[#E2E8F0] bg-[#FFFFFF]">
              <BrainCircuit className="h-12 w-12 text-[#1E3A8A]/30 mb-3" />
              Fill project execution parameters and submit to run XGBoost model prediction.
            </Card>
          )}

          {loading && (
            <Card className="p-8 text-center text-slate-600 text-xs flex flex-col items-center justify-center min-h-[350px] border-[#E2E8F0] bg-[#FFFFFF]">
              <Loader2 className="h-10 w-10 animate-spin text-[#1E3A8A] mb-3" />
              Evaluating Conflict Model & Priority Classifier...
            </Card>
          )}

          {result && pred && (
            <div className="space-y-4">
              {/* Main Conflict Status Card */}
              <div
                className={`rounded-lg border p-4 shadow-sm ${
                  isConflict ? "border-[#DC2626]/40 bg-[#DC2626]/5" : "border-[#16A34A]/40 bg-[#16A34A]/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isConflict ? (
                      <TriangleAlert className="h-7 w-7 text-[#DC2626]" />
                    ) : (
                      <ShieldCheck className="h-7 w-7 text-[#16A34A]" />
                    )}
                    <div>
                      <span className={`font-black text-sm tracking-wide ${isConflict ? "text-[#DC2626]" : "text-[#16A34A]"}`}>
                        {isConflict ? "HIGH CONFLICT RISK DETECTED" : "CLEAN INFRASTRUCTURE CORRIDOR"}
                      </span>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Model Confidence Score: <span className="font-extrabold text-[#0F172A]">{confidence}%</span>
                      </p>
                    </div>
                  </div>
                  <PriorityBadge priority={pred.priorityPrediction} />
                </div>
              </div>

              {/* Module 2: Explainable Feature Attribution Accordion */}
              <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
                <CardHeader className="p-4 cursor-pointer flex flex-row items-center justify-between border-b border-[#E2E8F0] bg-[#F8FAFC]" onClick={() => setShowXai(!showXai)}>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-[#3B82F6]" />
                    <div>
                      <CardTitle className="text-xs font-bold text-[#0F172A]">Module 2 — Explainable Feature Attribution (XAI)</CardTitle>
                      <CardDescription className="text-[11px] text-slate-600 font-medium">Spatial, timeline, and resource overlap triggers</CardDescription>
                    </div>
                  </div>
                  {showXai ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                </CardHeader>
                {showXai && (
                  <CardContent className="p-4 space-y-2 bg-[#FFFFFF]">
                    <ul className="space-y-2 text-xs">
                      {pred.explanations && pred.explanations.length > 0 ? (
                        pred.explanations.map((exp, idx) => (
                          <li key={idx} className="flex items-start gap-2 p-2.5 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                            <span className="h-2 w-2 rounded-full bg-[#3B82F6] mt-1 shrink-0"></span>
                            <span className="text-[#0F172A] font-semibold">{exp}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-500 font-medium">No specific risk triggers identified.</li>
                      )}
                    </ul>
                  </CardContent>
                )}
              </Card>

              {/* Module 3: Strategy Recommendation Cards */}
              <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
                <CardHeader className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                    <div>
                      <CardTitle className="text-xs font-bold text-[#0F172A]">Module 3 — Automated Mitigation Recommendations</CardTitle>
                      <CardDescription className="text-[11px] text-slate-600 font-medium">Actionable interventions to prevent project collisions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 bg-[#FFFFFF]">
                  <div className="grid grid-cols-1 gap-2">
                    {pred.recommendations && pred.recommendations.length > 0 ? (
                      pred.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0F172A]">💡 {rec}</span>
                          <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#1E3A8A] text-[#1E3A8A] font-bold hover:bg-[#1E3A8A]/10">
                            Apply Strategy
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 font-medium">Standard project schedule applies.</p>
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
