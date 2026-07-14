import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Building2, MapPin, Upload, Send, CheckCircle2, Clock,
  Megaphone, ArrowLeft, Bell, FileText, Search, AlertTriangle,
  Droplets, Zap, Trash2, Construction, Waves, ChevronRight,
  TrendingUp, User, Calendar, BadgeCheck, Info, X, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { complaintsApi, alertsApi, dashboardApi, ComplaintData, AlertData } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Dashboard — SmartCity OS" },
      { name: "description", content: "Report civic issues, track complaints, and view city alerts." },
    ],
  }),
  component: CitizenDashboard,
});

const CATEGORIES = ["Road Damage", "Water Leakage", "Street Light Failure", "Garbage Issue", "Drainage Problem"];
const ZONES = ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"];

const categoryIcons: Record<string, React.ElementType> = {
  "Road Damage": Construction,
  "Water Leakage": Droplets,
  "Street Light Failure": Zap,
  "Garbage Issue": Trash2,
  "Drainage Problem": Waves,
};

const statusColor: Record<string, string> = {
  SUBMITTED: "text-blue-500 bg-blue-500/10",
  UNDER_REVIEW: "text-warning bg-warning/10",
  ASSIGNED: "text-purple-500 bg-purple-500/10",
  IN_PROGRESS: "text-orange-500 bg-orange-500/10",
  RESOLVED: "text-success bg-success/10",
};

const statusLabel: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

const alertStyle: Record<string, { bg: string; icon: React.ElementType; color: string }> = {
  warning: { bg: "border-warning/30 bg-warning/5", icon: AlertTriangle, color: "text-warning" },
  info: { bg: "border-blue-400/30 bg-blue-400/5", icon: Info, color: "text-blue-500" },
  success: { bg: "border-success/30 bg-success/5", icon: BadgeCheck, color: "text-success" },
};

const progressSteps = [
  { label: "Submitted", threshold: 0 },
  { label: "Under Review", threshold: 20 },
  { label: "Assigned to Department", threshold: 40 },
  { label: "Work In Progress", threshold: 70 },
  { label: "Resolved", threshold: 100 },
];

type Tab = "report" | "myreports" | "track" | "alerts";

function CitizenDashboard() {
  const user = (() => { try { return JSON.parse(sessionStorage.getItem("user") ?? "{}"); } catch { return {}; } })();

  const [tab, setTab] = useState<Tab>("report");

  // Report form
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [zone, setZone] = useState(ZONES[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // My reports
  const [myReports, setMyReports] = useState<ComplaintData[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Track
  const [trackId, setTrackId] = useState("");
  const [tracked, setTracked] = useState<ComplaintData | null>(null);
  const [allComplaints, setAllComplaints] = useState<ComplaintData[]>([]);
  const [trackLoading, setTrackLoading] = useState(false);

  // Alerts
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState({ totalProjects: 0, conflictProjects: 0, lowPriorityProjects: 0 });

  const loadMyReports = useCallback(async () => {
    if (!user.id) return;
    setReportsLoading(true);
    try {
      const data = await complaintsApi.getByUser(user.id);
      setMyReports(data);
    } catch { toast.error("Failed to load reports"); }
    finally { setReportsLoading(false); }
  }, [user.id]);

  const loadAllComplaints = useCallback(async () => {
    try { setAllComplaints(await complaintsApi.getAll()); } catch { /* silent */ }
  }, []);

  const loadAlerts = useCallback(async () => {
    setAlertsLoading(true);
    try { setAlerts(await alertsApi.getActive()); }
    catch { /* silent */ }
    finally { setAlertsLoading(false); }
  }, []);

  const loadStats = useCallback(async () => {
    try { const d = await dashboardApi.get(); setStats(d); } catch { /* silent */ }
  }, []);

  useEffect(() => { loadMyReports(); loadAlerts(); loadStats(); loadAllComplaints(); }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.id) { toast.error("Please login first"); return; }
    setSubmitting(true);
    try {
      const res = await complaintsApi.create({
        userId: user.id,
        userName: user.name,
        category,
        description,
        zone,
      });
      toast.success("Report submitted!", { description: `Tracking ID: #${res.id}` });
      setDescription(""); setImage(null); setPreview(null);
      loadMyReports();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally { setSubmitting(false); }
  };

  const handleTrack = async () => {
    const numId = parseInt(trackId.replace(/\D/g, ""));
    if (!numId) { toast.error("Enter a valid complaint ID"); return; }
    setTrackLoading(true);
    try {
      const data = await complaintsApi.getById(numId);
      setTracked(data);
    } catch { toast.error("No complaint found with that ID"); }
    finally { setTrackLoading(false); }
  };

  const handleDismiss = async (id: number) => {
    try {
      await alertsApi.dismiss(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch { toast.error("Failed to dismiss alert"); }
  };

  const resolvedCount = myReports.filter((r) => r.status === "RESOLVED").length;

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "report", label: "Report Issue", icon: Megaphone },
    { id: "myreports", label: "My Reports", icon: FileText, badge: myReports.length || undefined },
    { id: "track", label: "Track", icon: Search },
    { id: "alerts", label: "Alerts", icon: Bell, badge: alerts.length || undefined },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-semibold text-foreground">SmartCity OS</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground">{user.name ?? "Citizen"}</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/login"><ArrowLeft className="h-4 w-4" /> Sign out</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-hero p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold">Welcome, {user.name ?? "Citizen"} 👋</h1>
          <p className="mt-1 text-sm text-primary-foreground/80">Report issues, track your complaints, and stay updated with city alerts.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            {[
              { label: "My Reports", value: myReports.length, icon: FileText },
              { label: "Resolved", value: resolvedCount, icon: CheckCircle2 },
              { label: "Active Alerts", value: alerts.length, icon: Bell },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl bg-primary-foreground/10 px-4 py-2">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{value} {label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border bg-muted p-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors sm:text-sm",
                tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
              {t.badge ? (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{t.badge}</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── Report Issue ── */}
        {tab === "report" && (
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Megaphone className="h-5 w-5 text-primary" /> Report a Civic Issue</h2>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium">Issue Category</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORIES.map((c) => {
                    const Icon = categoryIcons[c] ?? Megaphone;
                    return (
                      <button key={c} type="button" onClick={() => setCategory(c)}
                        className={cn("flex items-center gap-2 rounded-xl border p-3 text-left text-sm transition-colors",
                          category === c ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" : "bg-background hover:bg-accent/40")}>
                        <Icon className="h-4 w-4 shrink-0" /> {c}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail…"
                  className="mt-1 w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Upload Image</label>
                  <label className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background px-3 py-3 text-sm text-muted-foreground hover:bg-accent/40">
                    {preview ? <img src={preview} alt="preview" className="h-20 w-full rounded object-cover" /> : <><Upload className="h-4 w-4" /> Choose file</>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                  </label>
                  {image && <p className="mt-1 truncate text-xs text-muted-foreground">{image.name}</p>}
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium">Zone</label>
                    <div className="mt-1 flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full bg-transparent outline-none">
                        {ZONES.map((z) => <option key={z}>{z}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Submit Report</>}
              </Button>
            </form>
          </div>
        )}

        {/* ── My Reports ── */}
        {tab === "myreports" && (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><FileText className="h-5 w-5 text-primary" /> My Submitted Reports</h2>
              {reportsLoading ? (
                <div className="mt-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : myReports.length === 0 ? (
                <div className="mt-8 text-center text-sm text-muted-foreground">No reports submitted yet.</div>
              ) : (
                <div className="mt-5 space-y-4">
                  {myReports.map((r) => {
                    const Icon = categoryIcons[r.category] ?? Megaphone;
                    return (
                      <div key={r.id} className="rounded-xl border bg-background p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{r.category}</p>
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {r.zone} · {new Date(r.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", statusColor[r.status] ?? "bg-muted text-muted-foreground")}>
                            {statusLabel[r.status] ?? r.status}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span><span>{r.progress}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className={cn("h-2 rounded-full transition-all", r.progress === 100 ? "bg-success" : "bg-primary")} style={{ width: `${r.progress}%` }} />
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Report ID: <span className="font-mono font-medium text-foreground">#{r.id}</span></p>
                        {r.description && <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resolved summary */}
            {resolvedCount > 0 && (
              <div className="rounded-2xl border bg-card p-5">
                <h2 className="flex items-center gap-2 text-base font-semibold"><CheckCircle2 className="h-5 w-5 text-success" /> Resolved Reports</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {myReports.filter((r) => r.status === "RESOLVED").map((r) => (
                    <div key={r.id} className="rounded-xl border border-success/30 bg-success/5 p-4">
                      <div className="flex items-center gap-2 text-success text-xs font-semibold uppercase tracking-wide">
                        <CheckCircle2 className="h-4 w-4" /> Resolved
                      </div>
                      <p className="mt-2 font-medium text-foreground">{r.category}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.zone} · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Track ── */}
        {tab === "track" && (
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Search className="h-5 w-5 text-primary" /> Track Your Report</h2>
            <p className="mt-1 text-sm text-muted-foreground">Enter your complaint ID to get real-time status.</p>
            <div className="mt-5 flex gap-2">
              <input value={trackId} onChange={(e) => setTrackId(e.target.value)}
                placeholder="e.g. 1 or #1"
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              <Button onClick={handleTrack} disabled={trackLoading}>
                {trackLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4" /> Track</>}
              </Button>
            </div>

            {tracked && (
              <div className="mt-6 rounded-xl border bg-background p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => { const Icon = categoryIcons[tracked.category] ?? Megaphone; return <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>; })()}
                    <div>
                      <p className="font-semibold text-foreground">{tracked.category}</p>
                      <p className="text-xs text-muted-foreground">{tracked.zone} · {new Date(tracked.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusColor[tracked.status] ?? "bg-muted text-muted-foreground")}>
                    {statusLabel[tracked.status] ?? tracked.status}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Resolution Progress</span><span>{tracked.progress}%</span></div>
                  <div className="h-2.5 w-full rounded-full bg-muted">
                    <div className={cn("h-2.5 rounded-full", tracked.progress === 100 ? "bg-success" : "bg-primary")} style={{ width: `${tracked.progress}%` }} />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {progressSteps.map((step) => {
                    const done = tracked.progress >= step.threshold;
                    return (
                      <div key={step.label} className="flex items-center gap-3">
                        <div className={cn("h-5 w-5 shrink-0 rounded-full flex items-center justify-center", done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                          {done ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        </div>
                        <span className={cn("text-sm", done ? "text-foreground font-medium" : "text-muted-foreground")}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
                {tracked.description && <p className="mt-3 text-sm text-muted-foreground border-t pt-3">{tracked.description}</p>}
              </div>
            )}

            {/* All complaints */}
            {allComplaints.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-foreground">All Complaints</p>
                <div className="space-y-2">
                  {allComplaints.map((c) => (
                    <button key={c.id} onClick={() => { setTrackId(String(c.id)); setTracked(c); }}
                      className="flex w-full items-center justify-between rounded-xl border bg-background p-3 text-left hover:bg-accent/40 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.category}</p>
                        <p className="text-xs text-muted-foreground">#{c.id} · {c.zone} · {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColor[c.status] ?? "bg-muted text-muted-foreground")}>
                          {statusLabel[c.status] ?? c.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Alerts ── */}
        {tab === "alerts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><Bell className="h-5 w-5 text-primary" /> City Alerts & Notifications</h2>
              {alerts.length > 0 && (
                <button onClick={async () => { await Promise.all(alerts.map((a) => alertsApi.dismiss(a.id))); setAlerts([]); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline">Dismiss all</button>
              )}
            </div>

            {alertsLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : alerts.length === 0 ? (
              <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
                <Bell className="mx-auto mb-3 h-8 w-8 opacity-30" />
                <p className="text-sm">No active alerts. You're all caught up!</p>
              </div>
            ) : (
              alerts.map((a) => {
                const style = alertStyle[a.type] ?? alertStyle.info;
                const Icon = style.icon;
                return (
                  <div key={a.id} className={cn("relative rounded-2xl border p-5", style.bg)}>
                    <button onClick={() => handleDismiss(a.id)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-start gap-3 pr-6">
                      <div className={cn("mt-0.5 shrink-0", style.color)}><Icon className="h-5 w-5" /></div>
                      <div>
                        <p className="font-semibold text-foreground">{a.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Live stats from dashboard */}
            <div className="rounded-2xl border bg-card p-5">
              <p className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> City Activity Summary</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Active Projects", value: stats.totalProjects, color: "text-primary" },
                  { label: "Conflict Projects", value: stats.conflictProjects, color: "text-destructive" },
                  { label: "My Reports", value: myReports.length, color: "text-warning" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl bg-muted/50 p-3">
                    <p className={cn("text-2xl font-bold", color)}>{value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
