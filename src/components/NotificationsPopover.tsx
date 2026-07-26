import { useEffect, useState, useRef } from "react";
import { Bell, TriangleAlert, Info, CheckCircle2, Trash2, X, Sparkles } from "lucide-react";
import { alertsApi, type AlertData } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertsApi.getActive();
      setAlerts(data ?? []);
    } catch {
      // silently ignore or set empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleDismiss = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await alertsApi.dismiss(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      toast.success("Alert dismissed");
    } catch {
      toast.error("Failed to dismiss alert");
    }
  };

  const handleDismissAll = async () => {
    try {
      await Promise.all(alerts.map((a) => alertsApi.dismiss(a.id)));
      setAlerts([]);
      toast.success("All alerts cleared");
    } catch {
      toast.error("Failed to clear alerts");
    }
  };

  const activeCount = alerts.length;

  return (
    <div className="relative shrink-0" ref={popoverRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative shrink-0 text-white hover:bg-blue-800"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) fetchAlerts();
        }}
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white shadow-sm">
            {activeCount > 9 ? "9+" : activeCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] text-[#0F172A] p-0 shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3 bg-[#F8FAFC] rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#1E3A8A]" />
              <h3 className="text-xs font-bold text-[#0F172A]">System Notifications</h3>
              {activeCount > 0 && (
                <span className="rounded-full bg-[#1E3A8A]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E3A8A]">
                  {activeCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {activeCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismissAll}
                  className="h-6 text-[10px] text-slate-500 hover:text-[#DC2626] px-2 font-bold"
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-500 hover:text-[#0F172A]"
                onClick={() => setOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-[#E2E8F0]">
            {loading && alerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium">
                Loading notifications...
              </div>
            ) : alerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-medium flex flex-col items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-[#16A34A]" />
                <p className="font-bold text-[#0F172A]">All System Checks Operational</p>
                <p className="text-[11px]">No active conflict alerts flagged.</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const isWarning = alert.type === "warning" || alert.type === "danger" || alert.type === "error";
                const isSuccess = alert.type === "success";

                return (
                  <div
                    key={alert.id}
                    className="group relative flex items-start gap-3 rounded-md p-3 pt-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded ${
                        isWarning
                          ? "bg-[#DC2626]/10 text-[#DC2626]"
                          : isSuccess
                          ? "bg-[#16A34A]/10 text-[#16A34A]"
                          : "bg-[#1E3A8A]/10 text-[#1E3A8A]"
                      }`}
                    >
                      {isWarning ? (
                        <TriangleAlert className="h-4 w-4" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-xs font-bold text-[#0F172A] leading-snug">
                        {alert.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDismiss(alert.id, e)}
                      className="absolute top-3 right-3 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-[#DC2626] transition-opacity"
                      title="Dismiss alert"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
