import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, FolderKanban, Loader2, Trash2, Send, Clock, CheckCircle2, XCircle, FileText } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge, PriorityBadge } from "./officer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { projectsApi, type ProjectData, type ProjectPayload } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Management — SmartCity OS" },
      { name: "description", content: "Create and manage inter-departmental city projects." },
    ],
  }),
  component: ProjectsPage,
});

const DEPARTMENTS = ["Road", "Water", "Electricity", "Drainage", "Waste Management"];
const field = "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const defaultForm = (): ProjectPayload => ({
  projectName: "", department: DEPARTMENTS[0], projectType: "Infrastructure",
  zone: "Zone 1", budgetLakhs: 0, durationDays: 30,
  trafficDensity: 5, weatherRisk: 5, utilityDependency: 5,
  populationDensity: 5, criticalInfrastructure: 5, citizenImpact: 5,
  resourceRequirement: 5, contractorAvailability: 5, status: "DRAFT",
});

const sanctionBadge: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  DRAFT:            { label: "Draft",            cls: "bg-muted text-muted-foreground",       icon: FileText },
  PENDING_APPROVAL: { label: "Awaiting Approval", cls: "bg-warning/15 text-warning",           icon: Clock },
  ACTIVE:           { label: "Approved",          cls: "bg-success/15 text-success",            icon: CheckCircle2 },
  REJECTED:         { label: "Rejected",          cls: "bg-destructive/15 text-destructive",    icon: XCircle },
  COMPLETED:        { label: "Completed",         cls: "bg-primary/10 text-primary",            icon: CheckCircle2 },
  ON_HOLD:          { label: "On Hold",           cls: "bg-warning/15 text-warning",            icon: Clock },
};

const WORKFLOW_STEPS = [
  { key: "DRAFT",            label: "Draft Created" },
  { key: "PENDING_APPROVAL", label: "Submitted for Approval" },
  { key: "ACTIVE",           label: "Sanctioned & Active" },
  { key: "COMPLETED",        label: "Completed" },
];

function WorkflowBadge({ status }: { status: string }) {
  const s = sanctionBadge[status] ?? { label: status, cls: "bg-muted text-muted-foreground", icon: FileText };
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", s.cls)}>
      <Icon className="h-3 w-3" /> {s.label}
    </span>
  );
}

function ProjectsPage() {
  const user = (() => { try { return JSON.parse(sessionStorage.getItem("user") ?? "{}"); } catch { return {}; } })();
  const [list, setList] = useState<ProjectData[]>([]);
  const [form, setForm] = useState<ProjectPayload>(defaultForm());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState<ProjectData | null>(null);

  useEffect(() => {
    projectsApi.getAll()
      .then(setList)
      .catch(() => toast.error("Failed to load projects"))
      .finally(() => setFetching(false));
  }, []);

  const set = (key: keyof ProjectPayload, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName.trim()) return;
    setLoading(true);
    try {
      const created = await projectsApi.create({ ...form, status: "DRAFT" });
      setList((l) => [created, ...l]);
      setForm(defaultForm());
      toast.success("Project saved as Draft", { description: "Submit for approval when ready." });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create project");
    } finally { setLoading(false); }
  };

  const handleSubmitForApproval = async (p: ProjectData) => {
    try {
      const updated = await projectsApi.update(p.id, { ...p, status: "PENDING_APPROVAL" });
      setList((l) => l.map((x) => x.id === p.id ? updated : x));
      if (selected?.id === p.id) setSelected(updated);
      toast.success("Submitted for Admin approval");
    } catch { toast.error("Failed to submit"); }
  };

  const handleDelete = async (id: number) => {
    try {
      await projectsApi.delete(id);
      setList((l) => l.filter((p) => p.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Project deleted");
    } catch { toast.error("Failed to delete project"); }
  };

  const currentStep = (status: string) => WORKFLOW_STEPS.findIndex((s) => s.key === status);

  return (
    <DashboardShell title="Project Management" subtitle="Create · Submit · Get Sanctioned">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Create Form */}
        <section className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <Plus className="h-5 w-5 text-primary" /> New Project
          </h2>
          {/* Workflow info banner */}
          <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Sanction Workflow</p>
            <div className="flex items-center gap-1 flex-wrap">
              {WORKFLOW_STEPS.map((s, i) => (
                <span key={s.key} className="flex items-center gap-1">
                  <span className="rounded bg-muted px-1.5 py-0.5">{s.label}</span>
                  {i < WORKFLOW_STEPS.length - 1 && <span className="text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
          </div>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-foreground">Project Name</label>
              <input value={form.projectName} onChange={(e) => set("projectName", e.target.value)} placeholder="e.g. Stormwater Drain Upgrade" className={field} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <select value={form.department} onChange={(e) => set("department", e.target.value)} className={field}>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Project Type</label>
                <select value={form.projectType} onChange={(e) => set("projectType", e.target.value)} className={field}>
                  {["Infrastructure", "Construction", "Maintenance", "Smart Infra"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Zone</label>
                <select value={form.zone} onChange={(e) => set("zone", e.target.value)} className={field}>
                  {["Zone 1","Zone 2","Zone 3","Zone 4","Zone 5","Zone 6","Zone 7"].map((z) => <option key={z}>{z}</option>)}
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
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><FileText className="h-4 w-4" /> Save as Draft</>}
            </Button>
          </form>
        </section>

        {/* Project List + Detail */}
        <section className="flex flex-col gap-4 lg:col-span-3">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <FolderKanban className="h-5 w-5 text-primary" /> My Projects
              <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{list.length}</span>
            </h2>
            <div className="mt-4">
              {fetching ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : list.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No projects yet. Create one above.</p>
              ) : (
                <div className="space-y-2">
                  {list.map((p) => (
                    <div key={p.id}
                      onClick={() => setSelected(selected?.id === p.id ? null : p)}
                      className={cn("cursor-pointer rounded-xl border p-3 transition-colors hover:bg-accent/40",
                        selected?.id === p.id ? "border-primary bg-primary/5" : "bg-background")}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground text-sm">{p.projectName}</p>
                          <p className="text-xs text-muted-foreground">{p.department} · {p.zone} · ₹{p.budgetLakhs}L</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <WorkflowBadge status={p.status} />
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                            className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {p.prediction && (
                        <div className="mt-1.5 flex gap-2">
                          <PriorityBadge priority={p.prediction.priorityPrediction} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Project Detail / Workflow Panel */}
          {selected && (
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <h2 className="font-semibold text-foreground">{selected.projectName}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{selected.department} · {selected.zone} · ₹{selected.budgetLakhs}L · {selected.durationDays} days</p>

              {/* Workflow stepper */}
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Sanction Progress</p>
                <div className="flex items-center gap-0">
                  {WORKFLOW_STEPS.map((step, i) => {
                    const cur = currentStep(selected.status);
                    const done = i <= cur;
                    const isRejected = selected.status === "REJECTED";
                    return (
                      <div key={step.key} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center">
                          <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                            isRejected && i === 2 ? "border-destructive bg-destructive text-destructive-foreground" :
                            done ? "border-primary bg-primary text-primary-foreground" :
                            "border-muted bg-background text-muted-foreground")}>
                            {isRejected && i === 2 ? <XCircle className="h-3.5 w-3.5" /> : done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                          </div>
                          <p className={cn("mt-1 text-center text-[10px] leading-tight max-w-[60px]",
                            done ? "text-foreground font-medium" : "text-muted-foreground")}>{step.label}</p>
                        </div>
                        {i < WORKFLOW_STEPS.length - 1 && (
                          <div className={cn("h-0.5 flex-1 mx-1 mb-4", i < cur ? "bg-primary" : "bg-muted")} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sanction info */}
              {(selected.sanctionedBy || selected.sanctionRemark) && (
                <div className={cn("mt-4 rounded-lg border p-3 text-sm",
                  selected.status === "ACTIVE" ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5")}>
                  {selected.sanctionedBy && (
                    <p className="text-xs text-muted-foreground">
                      {selected.status === "ACTIVE" ? "✅ Approved" : "❌ Rejected"} by <span className="font-medium text-foreground">{selected.sanctionedBy}</span>
                    </p>
                  )}
                  {selected.sanctionRemark && (
                    <p className="mt-1 text-xs text-muted-foreground">Remark: <span className="text-foreground">{selected.sanctionRemark}</span></p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                {selected.status === "DRAFT" && (
                  <Button size="sm" onClick={() => handleSubmitForApproval(selected)} className="gap-1.5">
                    <Send className="h-3.5 w-3.5" /> Submit for Approval
                  </Button>
                )}
                {selected.status === "PENDING_APPROVAL" && (
                  <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-xs text-warning">
                    <Clock className="h-4 w-4" /> Waiting for Admin to sanction…
                  </div>
                )}
                {selected.status === "REJECTED" && (
                  <Button size="sm" variant="outline" onClick={() => handleSubmitForApproval({ ...selected, status: "DRAFT" } as ProjectData)} className="gap-1.5">
                    <Send className="h-3.5 w-3.5" /> Resubmit
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
