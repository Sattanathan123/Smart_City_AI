import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertTriangle, Info, CheckCircle2, RefreshCw } from "lucide-react";
import { notificationsApi, NotificationData } from "@/lib/api";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications & Real-Time Alerts — URBAN PULSE Platform" },
      { name: "description", content: "View full notification history and live system alerts." },
    ],
  }),
  component: NotificationsHistoryPage,
});

export default function NotificationsHistoryPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
      const data = await notificationsApi.get(user.role ?? "CITIZEN", user.id);
      setNotifications(data ?? []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // Ignore
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "ALL") return true;
    return n.type === filterType;
  });

  return (
    <DashboardShell title="Notifications & System Alerts" subtitle="Live Real-Time Event Dispatch & Message History">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              Live Real-Time Communication Engine
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1 flex items-center gap-2">
              Notification Center <Bell className="h-6 w-6 text-[#1E3A8A]" />
            </h1>
          </div>

          <Button variant="outline" size="sm" onClick={loadNotifications} className="gap-2 text-xs border-[#E2E8F0] text-[#0F172A]">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Feed
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
          {["ALL", "COMPLAINT", "CONFLICT", "ALERT", "APPROVAL"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterType === type ? "bg-[#1E3A8A] text-white" : "bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="border border-[#E2E8F0] bg-white p-8 text-center text-xs text-[#64748B]">
              No notifications matching current filter.
            </Card>
          ) : (
            filtered.map((n) => (
              <Card
                key={n.id}
                className={`border transition-all ${
                  n.read ? "border-[#E2E8F0] bg-white" : "border-blue-200 bg-blue-50/40 shadow-xs"
                }`}
              >
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {n.type === "CONFLICT" ? (
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-amber-600 shrink-0">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    ) : n.type === "APPROVAL" ? (
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-[#1E3A8A] shrink-0">
                        <Info className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A]">{n.title}</h4>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold bg-[#F1F5F9]">
                          {n.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-2">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now"}
                      </p>
                    </div>
                  </div>

                  {!n.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkRead(n.id)}
                      className="text-xs border-[#1E3A8A] text-[#1E3A8A] font-bold h-8 shrink-0 gap-1"
                    >
                      <Check className="h-3.5 w-3.5" /> Mark Read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
