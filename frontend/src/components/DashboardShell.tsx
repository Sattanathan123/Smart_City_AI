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
  Users,
  Landmark,
  Layers,
} from "lucide-react";
import { type ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationsPopover } from "@/components/NotificationsPopover";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n";

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
  const { t } = useLanguage();

  const navGroups = [
    {
      category: t.officerWorkspace,
      items: [
        { title: t.departmentDashboard, url: "/officer", icon: LayoutDashboard },
        { title: t.projectProposals, url: "/projects", icon: FolderKanban },
        { title: t.aiDecisionSupport, url: "/ai-conflict", icon: TriangleAlert },
      ],
    },
    {
      category: t.commandAndControl,
      items: [
        { title: t.municipalCommandCenter, url: "/admin", icon: Landmark },
        { title: t.gisSpatialMap, url: "/gis-map", icon: Map },
        { title: t.conflictHeatmap, url: "/conflict-heatmap", icon: Flame },
      ],
    },
    {
      category: t.executionAndResources,
      items: [
        { title: t.resourceOptimization, url: "/resource-optimization", icon: Cpu },
      ],
    },
    {
      category: t.securityAndAudit,
      items: [
        { title: t.systemAuditLogs, url: "/audit-logs", icon: ShieldCheck },
      ],
    },
  ];

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
                <p className="truncate text-xs font-black tracking-wider text-white uppercase">{t.appName}</p>
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

        {/* Sidebar Nav Grouped by Internal Government Modules */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-2">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#3B82F6]">
                  {group.category}
                </p>
              )}
              {group.items.map((item) => {
                const active = pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150",
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
            </div>
          ))}
        </nav>

        {/* Sidebar User Footer */}
        <div className="border-t border-slate-800 p-2 bg-[#0B132B]">
          {!collapsed && user.name && (
            <div className="mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 bg-slate-900 border border-slate-800">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1E3A8A] text-xs font-bold text-white border border-slate-700">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-100">{user.name}</p>
                <p className="truncate text-[10px] text-[#3B82F6] font-semibold capitalize">
                  {user.role ?? "Department Officer"}
                </p>
              </div>
            </div>
          )}
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>{t.signOut}</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 md:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-[#111827] hover:text-[#1E3A8A]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base font-black text-[#111827] tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <div className="relative hidden lg:block w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder={t.searchPlaceholder}
                className="h-8 pl-8 text-xs bg-[#F8FAFC] border-[#E5E7EB] text-[#111827]"
              />
            </div>
            <NotificationsPopover />
          </div>
        </header>

        {/* Dynamic Children Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FFFFFF]">{children}</main>
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
  icon: any;
  accent?: "primary" | "success" | "warning" | "destructive";
  hint?: string;
}) {
  const accentMap = {
    primary: "border-l-4 border-l-[#1E3A8A]",
    success: "border-l-4 border-l-[#16A34A]",
    warning: "border-l-4 border-l-[#F59E0B]",
    destructive: "border-l-4 border-l-[#DC2626]",
  };

  return (
    <div className={cn("rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] p-4 shadow-sm transition-all hover:shadow-md", accentMap[accent])}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className="grid h-8 w-8 place-items-center rounded bg-[#F8FAFC] text-[#1E3A8A]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-black text-[#111827]">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-slate-400 font-medium">{hint}</p>}
    </div>
  );
}
