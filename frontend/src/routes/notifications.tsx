import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertTriangle, Info, CheckCircle2, RefreshCw, Search, Filter } from "lucide-react";
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
  const [readFilter, setReadFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, readFilter, sortBy, pageSize]);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // Ignore
    }
  };

  const filtered = notifications.filter((n) => {
    if (filterType !== "ALL" && n.type !== filterType) return false;
    if (readFilter === "UNREAD" && n.read) return false;
    if (readFilter === "READ" && !n.read) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.message && n.message.toLowerCase().includes(q)) ||
      (n.type && n.type.toLowerCase().includes(q))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return b.id - a.id;
    if (sortBy === "oldest") return a.id - b.id;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginated = sorted.slice(startIndex, startIndex + pageSize);

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

        {/* Search, Filter, Sort & Page Control Toolbar */}
        <Card className="border border-[#E2E8F0] bg-white shadow-xs">
          <CardContent className="p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs bg-white text-[#0F172A] border-[#E2E8F0]"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5 text-[#1E3A8A]" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    <option value="ALL">All Types</option>
                    <option value="COMPLAINT">COMPLAINT</option>
                    <option value="CONFLICT">CONFLICT</option>
                    <option value="ALERT">ALERT</option>
                    <option value="APPROVAL">APPROVAL</option>
                    <option value="WEATHER_ALERT">WEATHER ALERT</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <select
                    value={readFilter}
                    onChange={(e) => setReadFilter(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    <option value="ALL">All Status</option>
                    <option value="UNREAD">Unread</option>
                    <option value="READ">Read</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <span className="font-medium text-slate-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Per Page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-bold text-[#0F172A]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-3">
          {paginated.length === 0 ? (
            <Card className="border border-[#E2E8F0] bg-white p-8 text-center text-xs text-[#64748B]">
              No notifications matching current filter or search query.
            </Card>
          ) : (
            paginated.map((n) => (
              <Card
                key={n.id}
                className={`border transition-all ${
                  n.read ? "border-[#E2E8F0] bg-white" : "border-blue-200 bg-blue-50/40 shadow-xs"
                }`}
              >
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {n.type === "CONFLICT" || n.type === "WEATHER_ALERT" ? (
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

        {/* Pagination Controls Bar */}
        <Card className="border border-[#E2E8F0] bg-[#F8FAFC]">
          <CardContent className="p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <b>{sorted.length === 0 ? 0 : startIndex + 1}</b> to <b>{Math.min(startIndex + pageSize, sorted.length)}</b> of <b>{sorted.length}</b> Notifications
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2.5 text-xs font-bold border-[#E2E8F0]"
              >
                &larr; Prev
              </Button>

              <span className="px-2 font-bold text-[#1E3A8A]">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2.5 text-xs font-bold border-[#E2E8F0]"
              >
                Next &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
