import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Plus,
  FolderKanban,
  Loader2,
  Trash2,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge, PriorityBadge } from "./officer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { projectsApi, type ProjectData, type ProjectPayload } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Project Portfolio Management — URBAN PULSE" },
      { name: "description", content: "Create, track, and manage inter-departmental infrastructure projects." },
    ],
  }),
  component: ProjectsPage,
});

const DEPARTMENTS = ["Road", "Water", "Electricity", "Drainage", "Waste Management"];
const fieldClass =
  "mt-1 w-full rounded-md border border-[#E5E7EB] bg-[#FFFFFF] px-3 py-2 text-xs text-[#111827] outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]";

const defaultForm = (): ProjectPayload => ({
  projectName: "",
  department: DEPARTMENTS[0],
  projectType: "Infrastructure",
  zone: "Zone 1",
  budgetLakhs: 50,
  durationDays: 30,
  trafficDensity: 5,
  weatherRisk: 5,
  utilityDependency: 5,
  populationDensity: 5,
  criticalInfrastructure: 5,
  citizenImpact: 5,
  resourceRequirement: 5,
  contractorAvailability: 5,
  status: "DRAFT",
});

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selected, setSelected] = useState<ProjectData | null>(null);
  const [form, setForm] = useState<ProjectPayload>(defaultForm());
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [user, setUser] = useState<{ id?: number; name?: string; email?: string; role?: string }>({});

  useEffect(() => {
    try {
      setUser(JSON.parse(sessionStorage.getItem("user") ?? "{}"));
    } catch {}
  }, []);

  const loadProjects = () => {
    projectsApi
      .getAll()
      .then((data) => {
        setProjects(data);
        if (data.length > 0 && !selected) setSelected(data[0]);
      })
      .catch(() => toast.error("Failed to load projects"));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const set = (key: keyof ProjectPayload, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    setSaving(true);
    try {
      const created = await projectsApi.create({ ...form, status: "DRAFT" });
      toast.success("Project draft created!");
      setIsNew(false);
      loadProjects();
      setSelected(created);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitApproval = async (p: ProjectData) => {
    try {
      const updated = await projectsApi.update(p.id, { ...p, status: "PENDING_APPROVAL" });
      toast.success("Submitted for Admin Sanction!");
      loadProjects();
      setSelected(updated);
    } catch {
      toast.error("Failed to submit");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await projectsApi.delete(id);
      toast.success("Project deleted");
      setSelected(null);
      loadProjects();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (deptFilter !== "ALL" && p.department !== deptFilter) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.projectName.toLowerCase().includes(q) || p.zone.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const headers = "ID,Project Name,Department,Zone,Budget Lakhs,Duration Days,Status\n";
    const rows = filteredProjects
      .map((p) => `"${p.id}","${p.projectName}","${p.department}","${p.zone}","${p.budgetLakhs}","${p.durationDays}","${p.status}"`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `URBAN_PULSE_Projects_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <DashboardShell title="Project Portfolio Management" subtitle="Municipal Infrastructure Registration & Approval Workflow">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E7EB] pb-4">
        <div>
          <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
            Portfolio & Sanctions Workflow
          </Badge>
          <h1 className="text-2xl font-black tracking-tight text-[#111827] mt-1">Infrastructure Projects</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 text-xs border-[#E5E7EB] text-[#111827]">
            <Download className="h-4 w-4" /> Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setForm(defaultForm());
              setIsNew(true);
            }}
            className="gap-2 text-xs bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold"
          >
            <Plus className="h-4 w-4" /> Register New Project
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search project, zone, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs bg-white border-[#E5E7EB] text-[#111827]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="h-3.5 w-3.5" />
              <span>Dept:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="h-8 text-xs rounded border border-[#E5E7EB] bg-white px-2 text-[#111827]"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 text-xs rounded border border-[#E5E7EB] bg-white px-2 text-[#111827]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredProjects.length} of {projects.length} Projects
          </span>
        </CardContent>
      </Card>

      {/* New Project Registration Modal Drawer / Form */}
      {isNew && (
        <Card className="border border-[#1E3A8A]/40 bg-[#FFFFFF] shadow-md">
          <CardHeader className="pb-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <CardTitle className="text-base font-bold text-[#1E3A8A]">Register New Infrastructure Project</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111827]">Project Name *</label>
                  <input
                    value={form.projectName}
                    onChange={(e) => set("projectName", e.target.value)}
                    placeholder="e.g. Stormwater Drain Main Extension"
                    className={fieldClass}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111827]">Department *</label>
                  <select value={form.department} onChange={(e) => set("department", e.target.value)} className={fieldClass}>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111827]">Zone *</label>
                  <select value={form.zone} onChange={(e) => set("zone", e.target.value)} className={fieldClass}>
                    {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"].map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111827]">Budget (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={form.budgetLakhs}
                    onChange={(e) => set("budgetLakhs", Number(e.target.value))}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111827]">Duration (Days)</label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => set("durationDays", Number(e.target.value))}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111827]">Traffic Index (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.trafficDensity}
                    onChange={(e) => set("trafficDensity", Number(e.target.value))}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#111827]">Utility Dependency (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.utilityDependency}
                    onChange={(e) => set("utilityDependency", Number(e.target.value))}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsNew(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-xs font-bold gap-1">
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save Project Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects Sticky Table & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View */}
        <div className="lg:col-span-2 border border-[#E5E7EB] rounded-lg bg-[#FFFFFF] shadow-sm overflow-hidden">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full text-xs text-left text-[#111827]">
              <thead className="bg-[#F8FAFC] text-slate-500 font-bold uppercase text-[10px] border-b border-[#E5E7EB] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Project & Zone</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Budget & Days</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={cn(
                      "cursor-pointer hover:bg-[#F8FAFC] transition",
                      selected?.id === p.id && "bg-[#3B82F6]/10 font-medium"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#111827]">{p.projectName}</div>
                      <div className="text-[10px] text-slate-500">{p.zone}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#1E3A8A]">{p.department}</td>
                    <td className="px-4 py-3">
                      ₹{p.budgetLakhs}L · {p.durationDays} Days
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      {p.prediction ? (
                        <PriorityBadge priority={p.prediction.priorityPrediction} />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Project Details Inspector Panel */}
        <div>
          {selected ? (
            <Card className="border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
              <CardHeader className="pb-3 border-b border-[#E5E7EB] bg-white">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20">
                    {selected.zone}
                  </Badge>
                  <StatusBadge status={selected.status} />
                </div>
                <CardTitle className="text-base font-bold text-[#111827] mt-2">{selected.projectName}</CardTitle>
                <p className="text-xs text-slate-500">{selected.department} Department</p>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded border border-[#E5E7EB] bg-white">
                    <span className="text-[10px] text-slate-400 font-semibold block">BUDGET ALLOCATED</span>
                    <span className="font-extrabold text-sm text-[#111827]">₹{selected.budgetLakhs} Lakhs</span>
                  </div>
                  <div className="p-2.5 rounded border border-[#E5E7EB] bg-white">
                    <span className="text-[10px] text-slate-400 font-semibold block">DURATION</span>
                    <span className="font-extrabold text-sm text-[#111827]">{selected.durationDays} Days</span>
                  </div>
                </div>

                {/* Workflow Control Button */}
                {selected.status === "DRAFT" && (
                  <Button
                    onClick={() => handleSubmitApproval(selected)}
                    className="w-full bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-xs gap-1.5"
                  >
                    <Send className="h-4 w-4" /> Submit for Sanction Approval
                  </Button>
                )}

                {selected.status === "PENDING_APPROVAL" && (
                  <div className="p-3 rounded border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>Awaiting Admin Sanction Approval</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E5E7EB] flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selected.id)}
                    className="text-xs text-[#DC2626] border-[#DC2626]/30 hover:bg-[#DC2626]/10 gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Entry
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-6 text-center text-slate-400 text-xs">
              Select any project row from the enterprise table to view metadata & workflow details.
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
