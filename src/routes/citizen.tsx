import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  MapPin,
  Upload,
  Send,
  CheckCircle2,
  Clock,
  Megaphone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { issueCategories, complaints, resolvedUpdates } from "@/lib/data";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Dashboard — SmartCity OS" },
      { name: "description", content: "Report civic issues, track complaints, and view city updates." },
    ],
  }),
  component: CitizenDashboard,
});

function CitizenDashboard() {
  const [category, setCategory] = useState(issueCategories[0]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-semibold text-foreground">SmartCity OS</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">Citizen Portal</span>
            <Button asChild variant="outline" size="sm">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4" /> Sign out
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <h1 className="text-2xl font-bold text-foreground">Citizen Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Report problems in your zone and follow them to resolution.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Report Civic Issue */}
          <section className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Megaphone className="h-5 w-5 text-primary" /> Report a Civic Issue
            </h2>
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Report submitted", {
                  description: `${category} reported. Tracking ID #C-90${Math.floor(Math.random() * 90 + 10)}`,
                });
              }}
            >
              <div>
                <label className="text-sm font-medium text-foreground">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {issueCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue in detail…"
                  className="mt-1 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Upload Image</label>
                  <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed bg-background px-3 py-3 text-sm text-muted-foreground hover:bg-accent/40">
                    <Upload className="h-4 w-4" /> Choose file
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <select className="w-full bg-transparent outline-none">
                      {["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"].map(
                        (z) => (
                          <option key={z}>{z}</option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4" /> Submit Report
              </Button>
            </form>
          </section>

          {/* Track Complaints */}
          <section className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Clock className="h-5 w-5 text-primary" /> Track Complaints
            </h2>
            <div className="mt-5 space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="rounded-xl border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{c.category}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {c.location} · {c.date}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-medium text-warning">
                      In Progress
                    </span>
                  </div>
                  <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                    {c.status}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* City Updates */}
        <section className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CheckCircle2 className="h-5 w-5 text-success" /> City Updates — Recently Resolved
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {resolvedUpdates.map((u) => (
              <div key={u.id} className="rounded-xl border border-success/30 bg-success/5 p-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Resolved</span>
                </div>
                <p className="mt-2 font-medium text-foreground">{u.category}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {u.location} · {u.date}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{u.status}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
