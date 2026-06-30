import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Layers, AlertTriangle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { zones, type Zone } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Smart City Map View — SmartCity OS" },
      { name: "description", content: "Interactive city map showing projects and citizen complaints by zone." },
    ],
  }),
  component: MapView,
});

const typeColor: Record<Zone["type"], string> = {
  water: "bg-info",
  road: "bg-destructive",
  completed: "bg-success",
  complaint: "bg-warning",
};

const legend = [
  { label: "Water Projects", cls: "bg-info" },
  { label: "Road Projects", cls: "bg-destructive" },
  { label: "Completed Projects", cls: "bg-success" },
  { label: "Citizen Complaints", cls: "bg-warning" },
];

const probColor: Record<string, string> = {
  Low: "text-success",
  Medium: "text-warning",
  High: "text-destructive",
};

function MapView() {
  const [selected, setSelected] = useState<Zone>(zones[4]);

  return (
    <DashboardShell title="Smart City Map View" subtitle="Live project & complaint distribution">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Layers className="h-5 w-5 text-primary" /> City Zones
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {legend.map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("h-2.5 w-2.5 rounded-full", l.cls)} /> {l.label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border bg-secondary/40">
            {/* faux map grid */}
            <svg className="absolute inset-0 h-full w-full text-border" aria-hidden>
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="currentColor" strokeWidth="1" />
              ))}
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={`${i * 12.5}%`} x2="100%" y2={`${i * 12.5}%`} stroke="currentColor" strokeWidth="1" />
              ))}
              <path d="M0 60 L100 60 M50 0 L50 100" stroke="var(--color-primary)" strokeOpacity="0.2" strokeWidth="6" />
            </svg>

            {zones.map((z) => {
              const active = selected.id === z.id;
              return (
                <button
                  key={z.id}
                  onClick={() => setSelected(z)}
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  aria-label={z.name}
                >
                  <span className="relative flex flex-col items-center">
                    {active && (
                      <span className={cn("absolute h-8 w-8 animate-ping rounded-full opacity-40", typeColor[z.type])} />
                    )}
                    <span
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-full text-primary-foreground shadow-md ring-2 ring-card transition-transform",
                        typeColor[z.type],
                        active && "scale-125",
                      )}
                    >
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="mt-1 rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow">
                      {z.name}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Selected Zone
          </span>
          <h2 className="mt-1 text-2xl font-bold text-foreground">{selected.name}</h2>

          <div className="mt-5 space-y-3">
            <Metric label="Active Projects" value={String(selected.activeProjects)} />
            <Metric label="Citizen Issues" value={String(selected.citizenIssues)} />
            <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-3">
              <span className="text-sm text-muted-foreground">Conflict Probability</span>
              <span className={cn("flex items-center gap-1 text-sm font-semibold", probColor[selected.conflictProbability])}>
                <AlertTriangle className="h-4 w-4" /> {selected.conflictProbability}
              </span>
            </div>
          </div>

          {selected.conflictProbability === "High" && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground">
              <p className="font-semibold text-destructive">AI Alert</p>
              <p className="mt-1 text-muted-foreground">
                Multiple overlapping projects detected in {selected.name}. Review the AI Conflict
                screen before scheduling new work.
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Click any marker on the map to inspect a zone.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  );
}
