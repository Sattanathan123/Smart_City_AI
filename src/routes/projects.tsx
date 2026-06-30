import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "./officer";
import { Button } from "@/components/ui/button";
import { departments, projects as seedProjects, type Project } from "@/lib/data";
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

const field =
  "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function ProjectsPage() {
  const [list, setList] = useState<Project[]>(seedProjects);
  const [name, setName] = useState("");
  const [dept, setDept] = useState(departments[0]);
  const [location, setLocation] = useState("Zone 5");

  return (
    <DashboardShell title="Project Management" subtitle="Create and track department projects">
      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <Plus className="h-5 w-5 text-primary" /> New Project
          </h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const newP: Project = {
                id: `P-${Math.floor(Math.random() * 9000 + 1000)}`,
                name,
                department: dept,
                location,
                type: "Infrastructure",
                status: "Planned",
                budget: "₹—",
                timeline: "TBD",
              };
              setList((l) => [newP, ...l]);
              setName("");
              toast.success("Project created", { description: `${newP.name} added as Planned.` });
            }}
          >
            <div>
              <label className="text-sm font-medium text-foreground">Project Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Stormwater Drain Upgrade" className={field} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Department</label>
                <select value={dept} onChange={(e) => setDept(e.target.value)} className={field}>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Project Type</label>
                <select className={field}>
                  {["Infrastructure", "Construction", "Maintenance", "Smart Infra"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={field}>
                {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"].map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <input type="date" className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">End Date</label>
                <input type="date" className={field} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Budget</label>
                <input placeholder="₹ 25,00,000" className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Required Resources</label>
                <input placeholder="Excavator, Crew" className={field} />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4" /> Create Project
            </Button>
          </form>
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-card lg:col-span-3">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <FolderKanban className="h-5 w-5 text-primary" /> Existing Projects
            <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {list.length}
            </span>
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Project Name</th>
                  <th className="px-3 py-2 font-medium">Department</th>
                  <th className="px-3 py-2 font-medium">Location</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-3 py-3">
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.id} · {p.budget}</p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{p.department}</td>
                    <td className="px-3 py-3 text-muted-foreground">{p.location}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
