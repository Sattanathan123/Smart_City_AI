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

  // Close popover when clicking outside
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
        variant="outline"
        size="icon"
        className="relative shrink-0 hover:bg-accent transition-colors"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) fetchAlerts();
        }}
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse shadow-sm">
            {activeCount > 9 ? "9+" : activeCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border bg-popover p-0 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-popover-foreground">System Alerts & Notifications</h3>
              {activeCount > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
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
                  className="h-7 text-xs text-muted-foreground hover:text-destructive px-2"
                >
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-2 divide-y divide-border/40">
            {loading && alerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Loading notifications...
              </div>
            ) : alerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-success/50" />
                <p className="font-medium text-foreground">All clear!</p>
                <p>No active conflict or priority alerts right now.</p>
              </div>
            ) : (
              alerts.map((alert) => {
                const isWarning = alert.type === "warning" || alert.type === "danger" || alert.type === "error";
                const isSuccess = alert.type === "success";

                return (
                  <div
                    key={alert.id}
                    className="group relative flex items-start gap-3 rounded-lg p-3 pt-3 transition-colors hover:bg-accent/50"
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                        isWarning
                          ? "bg-destructive/15 text-destructive"
                          : isSuccess
                          ? "bg-success/15 text-success"
                          : "bg-primary/15 text-primary"
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
                      <p className="text-xs font-semibold text-popover-foreground leading-snug">
                        {alert.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDismiss(alert.id, e)}
                      className="absolute top-3 right-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
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
