import React, { useState, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { notificationsApi, NotificationData } from "@/lib/api";

interface NotificationBellProps {
  role?: string;
  userId?: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ role = "CITIZEN", userId }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [open, setOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.get(role, userId);
      setNotifications(data ?? []);
    } catch {
      // Ignore background fetch error
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 6000);
    return () => clearInterval(interval);
  }, [role, userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] transition-colors shadow-sm focus:outline-none"
        title="Live WebSocket Notifications"
      >
        <Bell className="h-4 w-4 text-[#1E3A8A]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#E2E8F0] bg-white shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1E3A8A] text-white">
            <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" /> Real-Time Live Notifications ({unreadCount})
            </h4>
            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                No recent notifications available.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 transition-colors flex items-start justify-between gap-3 ${
                    n.read ? "bg-white text-[#64748B]" : "bg-blue-50/60 text-[#0F172A]"
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    {n.type === "CONFLICT" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    ) : n.type === "APPROVAL" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="h-4 w-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold leading-snug truncate">{n.title}</p>
                      <p className="text-[11px] leading-relaxed mt-0.5 text-[#475569]">{n.message}</p>
                      <p className="text-[9px] text-[#94A3B8] mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </p>
                    </div>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-xs text-[#1E3A8A] hover:text-blue-800 font-semibold p-1 shrink-0"
                      title="Mark as Read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
