import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  TriangleAlert,
  Map,
  FileBarChart,
  LogOut,
  Menu,
  X,
  Flame,
  Cpu,
  ShieldCheck,
  Search,
  UserCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  MessageSquareWarning,
} from "lucide-react";
import { type ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationsPopover } from "@/components/NotificationsPopover";

const navItems = [
  { title: "Dashboard", url: "/officer", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Predictive Conflicts", url: "/ai-conflict", icon: TriangleAlert },
  { title: "GIS Map View", url: "/gis-map", icon: Map },
  { title: "Spatial Heatmap", url: "/conflict-heatmap", icon: Flame },
  { title: "Resource Optimization", url: "/resource-optimization", icon: Cpu },
  { title: "Analytics & Reports", url: "/admin", icon: FileBarChart },
  { title: "Security Audit Logs", url: "/audit-logs", icon: ShieldCheck },
];

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name?: string; department?: string; role?: string }>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("user") ?? "{}");
      setUser(saved);
    } catch {
      setUser({});
    }
  }, []);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="flex h-screen w-full bg-[#FFFFFF] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0F172A] text-slate-300 transition-all duration-300 md:static border-r border-slate-800",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800 bg-[#0B132B]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#3B82F6] text-white font-black text-sm shadow-sm">
              UP
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-black tracking-wider text-white uppercase">URBAN PULSE</p>
                <p className="truncate text-[10px] text-slate-400 font-medium">Command Center OS</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {!collapsed && (
            <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Modules
            </p>
          )}
          {navItems.map((item) => {
            const active = pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-semibold transition-all duration-150",
                  active
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar User Footer */}
        <div className="border-t border-slate-800 p-2 bg-[#0B132B]">
          {!collapsed && user.name && (
            <div className="mb-2 flex items-center gap-2 rounded.md px-2 py-1.5 bg-slate-900">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1E3A8A] text-xs font-bold text-white border border-slate-700">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-100">{user.name}</p>
                <p className="truncate text-[10px] text-slate-400 capitalize">
                  {user.role ?? "Officer"}
                </p>
              </div>
            </div>
          )}
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign out</span>}
          </Link>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Command Center Header (#1E3A8A Dark Blue) */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 bg-[#1E3A8A] text-white px-4 md:px-6 shadow-md border-b border-blue-900">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden text-white hover:bg-blue-800"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm md:text-base font-bold text-white tracking-wide">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-[11px] text-blue-200 font-medium">{subtitle}</p>
            )}
          </div>

          {/* Quick Command Search Bar */}
          <div className="hidden lg:flex items-center relative w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-blue-300" />
            <Input
              placeholder="Search projects, zones, IDs..."
              className="h-8 pl-8 text-xs bg-blue-950/60 border-blue-800 text-white placeholder:text-blue-300 focus-visible:ring-1 focus-visible:ring-blue-400"
            />
          </div>

          {/* Notifications & Profile Pill */}
          <div className="flex items-center gap-3">
            <NotificationsPopover />

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-blue-800">
              <div className="text-right">
                <p className="text-xs font-bold text-white leading-none">
                  {user.name ?? "Municipal Officer"}
                </p>
                <p className="text-[10px] text-blue-200 capitalize mt-0.5">
                  {user.department ?? user.role ?? "Department Admin"}
                </p>
              </div>
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#3B82F6] text-xs font-extrabold text-white border border-blue-400 shadow-sm">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Main Body Canvas */}
        <main className="flex-1 overflow-auto bg-[#FFFFFF] p-4 md:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "primary",
  hint,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "success" | "warning" | "destructive";
  hint?: string;
}) {
  const accentMap: Record<string, string> = {
    primary: "bg-[#1E3A8A] text-white",
    success: "bg-[#16A34A] text-white",
    warning: "bg-[#F59E0B] text-white",
    destructive: "bg-[#DC2626] text-white",
  };

  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="mt-1 text-2xl font-black tracking-tight text-[#111827] sm:text-3xl">
            {value}
          </p>
          {hint && <p className="mt-1 text-[11px] text-slate-500 font-medium">{hint}</p>}
        </div>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-md shadow-sm", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
