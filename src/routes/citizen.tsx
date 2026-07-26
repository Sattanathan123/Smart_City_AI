import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Send,
  CheckCircle2,
  Clock,
  Megaphone,
  Bell,
  Search,
  AlertTriangle,
  Droplets,
  Zap,
  Trash2,
  Construction,
  Waves,
  User,
  BadgeCheck,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { complaintsApi, alertsApi, ComplaintData, AlertData } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/citizen")({
  head: () => ({
    meta: [
      { title: "Citizen Portal — URBAN PULSE Platform" },
      {
        name: "description",
        content: "Report civic issues, track complaints, and view city alerts.",
      },
    ],
  }),
  component: CitizenDashboard,
});

const CATEGORIES = [
  "Road Damage",
  "Water Leakage",
  "Street Light Failure",
  "Garbage Issue",
  "Drainage Problem",
];
const ZONES = ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "Zone 6", "Zone 7"];

const statusColor: Record<string, string> = {
  SUBMITTED: "text-[#3B82F6] bg-[#3B82F6]/10 font-bold border border-[#3B82F6]/30",
  UNDER_REVIEW: "text-[#F59E0B] bg-[#F59E0B]/10 font-bold border border-[#F59E0B]/30",
  ASSIGNED: "text-purple-600 bg-purple-100 font-bold border border-purple-300",
  IN_PROGRESS: "text-amber-600 bg-amber-100 font-bold border border-amber-300",
  RESOLVED: "text-[#16A34A] bg-[#16A34A]/10 font-bold border border-[#16A34A]/30",
};

const statusLabel: Record<string, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

type Tab = "report" | "myreports" | "track" | "alerts";

function CitizenDashboard() {
  const [user, setUser] = useState<{ id?: number; name?: string; email?: string; role?: string }>({});
  const [activeTab, setActiveTab] = useState<Tab>("report");

  // Form State
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [zone, setZone] = useState(ZONES[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  // Data State
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [searchTrackingId, setSearchTrackingId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState<ComplaintData | null>(null);
  const [trackError, setTrackError] = useState(false);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(sessionStorage.getItem("user") ?? "{}");
      setUser(savedUser);
    } catch {}
  }, []);

  const loadComplaints = useCallback(() => {
    complaintsApi
      .getAll()
      .then(setComplaints)
      .catch(() => {});
  }, []);

  const loadAlerts = useCallback(() => {
    alertsApi
      .getActive()
      .then(setAlerts)
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadComplaints();
    loadAlerts();
  }, [loadComplaints, loadAlerts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please fill in issue description");
      return;
    }
    setSubmitting(true);
    try {
      const created = await complaintsApi.create({
        userId: user.id ?? 1,
        userName: user.name ?? "Citizen User",
        category,
        description,
        zone,
      });
      setSubmittedId(created.id);
      toast.success("Complaint submitted successfully!");
      setDescription("");
      loadComplaints();
    } catch {
      toast.error("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(false);
    const id = parseInt(searchTrackingId.replace("#", "").trim(), 10);
    if (isNaN(id)) {
      setTrackError(true);
      setTrackedComplaint(null);
      return;
    }
    const found = complaints.find((c) => c.id === id);
    if (found) {
      setTrackedComplaint(found);
    } else {
      setTrackError(true);
      setTrackedComplaint(null);
    }
  };

  const fieldClass =
    "mt-1 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Navbar Header */}
      <header className="sticky top-0 z-30 border-b border-[#E2E8F0] bg-[#1E3A8A] text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#3B82F6] text-white font-black">
                UP
              </div>
              <span className="font-extrabold text-sm text-white tracking-wide">URBAN PULSE</span>
            </Link>
            <span className="hidden sm:inline text-xs text-blue-200 border-l border-blue-800 pl-3">
              Citizen Civic Services Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("alerts")}
              className="relative text-blue-100 hover:bg-blue-800 hover:text-white"
            >
              <Bell className="h-4 w-4" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-[#DC2626] text-[9px] font-black text-white">
                  {alerts.length}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2 text-xs">
              <User className="h-4 w-4 text-blue-300" />
              <span className="font-bold">{user.name ?? "Citizen"}</span>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs font-bold border-blue-400 text-white bg-transparent hover:bg-blue-800">
              <Link to="/login">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex rounded-md border border-[#E2E8F0] bg-[#FFFFFF] p-1 shadow-sm overflow-x-auto">
          {[
            { id: "report", label: "Report Civic Issue", icon: Megaphone },
            { id: "myreports", label: `My Complaints (${complaints.length})`, icon: Clock },
            { id: "track", label: "Track Status", icon: Search },
            { id: "alerts", label: `City Advisory Alerts (${alerts.length})`, icon: Bell },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as Tab)}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold whitespace-nowrap transition-all flex-1 justify-center",
                activeTab === t.id
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "text-slate-600 hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Report Issue */}
        {activeTab === "report" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
              <div className="border-b border-[#E2E8F0] pb-3">
                <h2 className="text-lg font-black text-[#0F172A]">Submit Civic Infrastructure Complaint</h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Report road damage, water leaks, or drainage issues directly to municipal departments.
                </p>
              </div>

              {submittedId ? (
                <div className="p-6 text-center space-y-3 bg-[#16A34A]/5 border border-[#16A34A]/30 rounded-lg">
                  <CheckCircle2 className="h-10 w-10 text-[#16A34A] mx-auto" />
                  <h3 className="text-base font-bold text-[#0F172A]">Complaint Submitted Successfully</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Tracking Identifier: <span className="font-extrabold text-[#1E3A8A]">#{submittedId}</span>
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setSubmittedId(null)}
                    className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs"
                  >
                    Submit Another Report
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#0F172A]">Issue Category *</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-white text-[#0F172A]">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#0F172A]">Municipal Zone *</label>
                      <select value={zone} onChange={(e) => setZone(e.target.value)} className={fieldClass}>
                        {ZONES.map((z) => (
                          <option key={z} value={z} className="bg-white text-[#0F172A]">{z}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0F172A]">Description of Issue & Location *</label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue details, pothole depth, or nearby landmarks..."
                      className={fieldClass}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-extrabold text-xs h-10 shadow-sm gap-2"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit Complaint Entry
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Helpline Info */}
            <div className="space-y-4">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-[#0F172A] flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#1E3A8A]" /> Municipal Helplines
                </h3>
                <div className="space-y-2 text-xs font-medium">
                  <div className="p-2.5 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                    <span className="text-slate-500 font-bold block">ROAD & DRAINAGE CONTROL</span>
                    <span className="font-mono text-[#0F172A] font-bold">1800-425-7001</span>
                  </div>
                  <div className="p-2.5 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                    <span className="text-slate-500 font-bold block">WATER SUPPLY LEAKAGE</span>
                    <span className="font-mono text-[#0F172A] font-bold">1800-425-7002</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: My Complaints */}
        {activeTab === "myreports" && (
          <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#0F172A]">Registered Complaints History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-[#0F172A]">
                <thead className="bg-[#F8FAFC] uppercase text-[10px] text-slate-500 font-bold border-b border-[#E2E8F0]">
                  <tr>
                    <th className="px-4 py-3">Tracking ID</th>
                    <th className="px-4 py-3">Category & Zone</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="px-4 py-3 font-mono font-bold text-[#1E3A8A]">#{c.id}</td>
                      <td className="px-4 py-3 font-bold">{c.category} ({c.zone})</td>
                      <td className="px-4 py-3 font-medium text-slate-600 max-w-xs truncate">{c.description}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 rounded text-[10px]", statusColor[c.status] ?? "bg-slate-100 text-slate-700 font-bold")}>
                          {statusLabel[c.status] ?? c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Track Status */}
        {activeTab === "track" && (
          <div className="max-w-2xl mx-auto rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#0F172A]">Track Complaint Status</h2>
            <form onSubmit={handleTrackSearch} className="flex gap-2">
              <input
                value={searchTrackingId}
                onChange={(e) => setSearchTrackingId(e.target.value)}
                placeholder="Enter Complaint Tracking # (e.g. 1)"
                className={fieldClass}
              />
              <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs px-6">
                Search
              </Button>
            </form>

            {trackedComplaint && (
              <div className="p-4 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <span className="font-extrabold text-sm text-[#1E3A8A]">Complaint #{trackedComplaint.id}</span>
                  <span className={cn("px-2.5 py-1 rounded text-[10px]", statusColor[trackedComplaint.status])}>
                    {statusLabel[trackedComplaint.status] ?? trackedComplaint.status}
                  </span>
                </div>
                <div className="text-xs space-y-1 font-medium text-[#0F172A]">
                  <p><b>Category:</b> {trackedComplaint.category}</p>
                  <p><b>Zone:</b> {trackedComplaint.zone}</p>
                  <p><b>Description:</b> {trackedComplaint.description}</p>
                </div>
              </div>
            )}

            {trackError && (
              <div className="p-4 rounded border border-[#DC2626]/30 bg-[#DC2626]/10 text-[#DC2626] font-bold text-xs text-center">
                No complaint entry found with that tracking identifier.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Alerts */}
        {activeTab === "alerts" && (
          <div className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-6 shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#0F172A]">Active City Advisory Alerts</h2>
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="p-4 rounded border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-xs font-medium space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1E3A8A] text-sm">{a.title}</span>
                    <span className="font-mono text-slate-500 text-[10px]">{a.type}</span>
                  </div>
                  <p className="text-slate-700">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
