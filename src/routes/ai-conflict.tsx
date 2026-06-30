import { createFileRoute } from "@tanstack/react-router";
import {
  TriangleAlert,
  MapPin,
  CalendarClock,
  Wrench,
  Check,
  Lightbulb,
  Droplet,
  Construction,
  BrainCircuit,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

export const Route = createFileRoute("/ai-conflict")({
  head: () => ({
    meta: [
      { title: "AI Project Conflict Detection — SmartCity OS" },
      { name: "description", content: "AI-powered analysis of overlapping projects, timelines, and resources." },
    ],
  }),
  component: AIConflictPage,
});

const projectA = {
  name: "Water Pipeline Installation",
  icon: Droplet,
  location: "Zone 5",
  timeline: "July – August",
  resource: "Excavator",
  dept: "Water Department",
};
const projectB = {
  name: "Road Construction",
  icon: Construction,
  location: "Zone 5",
  timeline: "August – September",
  resource: "Excavator",
  dept: "Road Department",
};

function ProjectCard({ p, color }: { p: typeof projectA; color: string }) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}>
          <p.icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{p.name}</h3>
          <p className="text-sm text-muted-foreground">{p.dept}</p>
        </div>
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <Row icon={MapPin} label="Location" value={p.location} />
        <Row icon={CalendarClock} label="Timeline" value={p.timeline} />
        <Row icon={Wrench} label="Resource" value={p.resource} />
      </dl>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function AIConflictPage() {
  return (
    <DashboardShell title="AI Project Conflict Detection" subtitle="Automated cross-department analysis">
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <p className="text-sm text-foreground">
          The AI engine continuously compares project locations, timelines, and shared resources to
          flag conflicts before work begins.
        </p>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <ProjectCard p={projectA} color="bg-info/15 text-info" />
        <div className="flex items-center justify-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="h-6 w-6" />
          </div>
        </div>
        <ProjectCard p={projectB} color="bg-destructive/10 text-destructive" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-destructive">
            <TriangleAlert className="h-5 w-5" /> Conflict Detected
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Both projects are scheduled in the same zone and require the same equipment.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Same Location", "Timeline Overlap", "Resource Conflict"].map((r) => (
              <div key={r} className="flex items-center gap-2 rounded-lg border bg-card px-3 py-3 text-sm font-medium text-foreground">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-destructive text-destructive-foreground">
                  <Check className="h-3 w-3" />
                </span>
                {r}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Lightbulb className="h-4 w-4 text-warning" /> AI Recommendation
            </h3>
            <p className="mt-2 text-sm text-foreground">
              “Complete water pipeline work before starting road construction.”
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-6 text-center shadow-card">
          <p className="text-sm font-medium text-muted-foreground">AI Confidence Score</p>
          <div className="relative mt-4 grid h-36 w-36 place-items-center">
            <svg className="h-36 w-36 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-muted)" strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--color-chart-2)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.92)}`}
              />
            </svg>
            <span className="absolute text-3xl font-bold text-foreground">92%</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            High confidence the flagged conflict is valid.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
