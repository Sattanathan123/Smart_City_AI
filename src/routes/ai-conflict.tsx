import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TriangleAlert,
  BrainCircuit,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
const DEPARTMENTS = ["Road", "Water", "Electricity", "Drainage", "Waste Management"];
import { predictApi, type ProjectData, type ProjectPayload } from "@/lib/api";
import { toast } from "sonner";
import { PriorityBadge } from "./officer";

export const Route = createFileRoute("/ai-conflict")({
  head: () => ({
    meta: [
      { title: "AI Project Conflict Detection — SmartCity OS" },
      { name: "description", content: "AI-powered analysis of overlapping projects, timelines, and resources." },
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
      toast.success("AI prediction complete");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const pred = result?.prediction;
  const isConflict = pred?.conflictPrediction === "Conflict";
  const confidence = pred ? Math.round(pred.conflictProbability * 100) : null;

  return (
    <DashboardShell title="AI Project Conflict Detection" subtitle="Automated cross-department analysis">
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <p className="text-sm text-foreground">
          Submit a project to the AI engine. It will detect conflict probability and assign a
          priority level, then save the project and prediction to the database.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <section className="rounded-xl border bg-card p-5 shadow-card">
          <h2 className="font-semibold text-foreground mb-4">Project Details</h2>
          <form className="space-y-3" onSubmit={handlePredict}>
            <div>
              <label className="text-sm font-medium text-foreground">Project Name</label>
              <input value={form.projectName} onChange={(e) => set("projectName", e.target.value)} placeholder="e.g. Water Pipeline Zone 5" className={field} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <select value={form.department} onChange={(e) => set("department", e.target.value)} className={field}>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Zone</label>
                <select value={form.zone} onChange={(e) => set("zone", e.target.value)} className={field}>
                  {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"].map((z) => <option key={z}>{z}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Project Type</label>
                <select value={form.projectType} onChange={(e) => set("projectType", e.target.value)} className={field}>
                  {["Infrastructure", "Construction", "Maintenance", "Smart Infra"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Budget (Lakhs)</label>
                <input type="number" value={form.budgetLakhs} onChange={(e) => set("budgetLakhs", Number(e.target.value))} className={field} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Duration (Days)</label>
                <input type="number" value={form.durationDays} onChange={(e) => set("durationDays", Number(e.target.value))} className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Traffic Density (1-10)</label>
                <input type="number" min={1} max={10} value={form.trafficDensity} onChange={(e) => set("trafficDensity", Number(e.target.value))} className={field} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Weather Risk (1-10)</label>
                <input type="number" min={1} max={10} value={form.weatherRisk} onChange={(e) => set("weatherRisk", Number(e.target.value))} className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Citizen Impact (1-10)</label>
                <input type="number" min={1} max={10} value={form.citizenImpact} onChange={(e) => set("citizenImpact", Number(e.target.value))} className={field} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Resource Req. (1-10)</label>
                <input type="number" min={1} max={10} value={form.resourceRequirement} onChange={(e) => set("resourceRequirement", Number(e.target.value))} className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Contractor Avail. (1-10)</label>
                <input type="number" min={1} max={10} value={form.contractorAvailability} onChange={(e) => set("contractorAvailability", Number(e.target.value))} className={field} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
                : <><BrainCircuit className="h-4 w-4" /> Run AI Prediction</>}
            </Button>
          </form>
        </section>

        {/* Result Panel */}
        <section className="rounded-xl border bg-card p-5 shadow-card flex flex-col">
          <h2 className="font-semibold text-foreground mb-4">Prediction Result</h2>

          {!result && !loading && (
            <div className="flex flex-1 items-center justify-center text-center text-muted-foreground text-sm">
              Submit a project to see AI predictions here.
            </div>
          )}

          {loading && (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {result && pred && (
            <div className="space-y-4">
              <div className={`rounded-xl border p-4 ${isConflict ? "border-destructive/30 bg-destructive/5" : "border-success/30 bg-success/5"}`}>
                <div className="flex items-center gap-2">
                  {isConflict
                    ? <TriangleAlert className="h-5 w-5 text-destructive" />
                    : <ShieldCheck className="h-5 w-5 text-success" />}
                  <span className={`font-semibold ${isConflict ? "text-destructive" : "text-success"}`}>
                    {isConflict ? "Conflict Detected" : "No Conflict"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isConflict
                    ? "This project has a high probability of conflicting with existing projects."
                    : "This project is unlikely to conflict with existing projects."}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-background p-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Conflict Probability</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{confidence}%</p>
                </div>
                <div className="relative grid h-20 w-20 place-items-center">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-muted)" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={isConflict ? "var(--color-destructive)" : "var(--color-chart-2)"}
                      strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - (pred.conflictProbability ?? 0))}`}
                    />
                  </svg>
                  <span className="absolute text-sm font-bold text-foreground">{confidence}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-background p-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Priority Level</p>
                  <div className="mt-2">
                    <PriorityBadge priority={pred.priorityPrediction} />
                  </div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-muted-foreground/30" />
              </div>

              <div className="rounded-xl border bg-background p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Project Saved</p>
                <p className="mt-1 font-medium text-foreground">{result.projectName}</p>
                <p className="text-xs text-muted-foreground">{result.department} · {result.zone} · ID #{result.id}</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
