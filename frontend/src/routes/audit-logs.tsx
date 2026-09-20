import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ShieldCheck, Filter } from "lucide-react";
import { fetchWithAuth } from "@/lib/api";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Security Audit Logs — URBAN PULSE Platform" },
      { name: "description", content: "System transparency and audit logging." },
    ],
  }),
  component: AuditLogsPage,
});

interface AuditLog {
  id: number;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sampleLogs: AuditLog[] = [
    {
      id: 1,
      userEmail: "admin@smartcity.gov.in",
      role: "ADMIN",
      action: "PROJECT_SANCTION_APPROVED",
      details: "Approved Central Flyover Structural Repair project with traffic rerouting condition.",
      ipAddress: "127.0.0.1",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      userEmail: "road.officer@smartcity.gov.in",
      role: "DEPARTMENT_OFFICER",
      action: "PROJECT_CREATED",
      details: "Created Zone 5 Arterial Road Construction project entry.",
      ipAddress: "192.168.1.45",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 3,
      userEmail: "citizen@gmail.com",
      role: "CITIZEN",
      action: "COMPLAINT_SUBMITTED",
      details: "Submitted Water Leakage complaint in Zone 5 main intersection.",
      ipAddress: "192.168.1.88",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 4,
      userEmail: "system.audit@smartcity.gov.in",
      role: "SYSTEM_SERVICE",
      action: "PREDICTIVE_CONFLICT_CHECK",
      details: "Generated 99.6% conflict risk warning for Zone 5 Metro Trenching & Road Overlay.",
      ipAddress: "localhost",
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
  ];

  useEffect(() => {
    fetchWithAuth<AuditLog[]>("/admin/audit-logs")
      .then((data) => setLogs(data && data.length > 0 ? data : sampleLogs))
      .catch(() => setLogs(sampleLogs));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, actionFilter, sortBy, pageSize]);

  // Filtering
  const filteredLogs = logs.filter((l) => {
    if (roleFilter !== "ALL" && l.role !== roleFilter) return false;
    if (actionFilter !== "ALL" && l.action !== actionFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      l.userEmail.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.role.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.ipAddress.toLowerCase().includes(q)
    );
  });

  // Sorting
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sortBy === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    if (sortBy === "user") return a.userEmail.localeCompare(b.userEmail);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + pageSize);

  const exportToCSV = () => {
    const headers = "ID,User,Role,Action,Details,IP,Timestamp\n";
    const rows = sortedLogs
      .map(
        (l) =>
          `"${l.id}","${l.userEmail}","${l.role}","${l.action}","${l.details.replace(/"/g, '""')}","${l.ipAddress}","${l.timestamp}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `URBAN_PULSE_Audit_Logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const roles = ["ALL", "ADMIN", "DEPARTMENT_OFFICER", "CITIZEN", "SYSTEM_SERVICE"];
  const actions = ["ALL", "PROJECT_SANCTION_APPROVED", "PROJECT_CREATED", "COMPLAINT_SUBMITTED", "PREDICTIVE_CONFLICT_CHECK"];

  return (
    <DashboardShell title="Security Audit Logs" subtitle="Immutable Audit Trail & Access Verification">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-3">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              System Security & Transparency
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1 flex items-center gap-2">
              System Audit Logs <ShieldCheck className="h-5 w-5 text-[#1E3A8A]" />
            </h1>
          </div>

          <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-2 text-xs border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]">
            <Download className="h-4 w-4" /> Export CSV Report
          </Button>
        </div>

        {/* Search, Filter, Sort & Page Control Toolbar */}
        <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
          <CardContent className="p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search user, action, or details..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs bg-white text-[#0F172A] border-[#E2E8F0]"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5 text-[#1E3A8A]" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>Role: {r.replace("_", " ")}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 font-semibold text-[#0F172A]"
                  >
                    {actions.map((a) => (
                      <option key={a} value={a}>Action: {a.replace("_", " ")}</option>
                    ))}
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
                    <option value="user">User Email (A-Z)</option>
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
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-[#0F172A]">
              <thead className="bg-[#F8FAFC] uppercase text-[10px] text-slate-500 font-bold border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User & Role</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Audit Details</th>
                  <th className="px-4 py-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                      No matching audit log entries found. Try clearing filters or search query.
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="px-4 py-3 font-mono text-slate-500 font-medium whitespace-nowrap">
                        {new Date(l.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-[#0F172A]">{l.userEmail}</div>
                        <Badge variant="outline" className="text-[9px] mt-0.5 font-bold">
                          {l.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-[#3B82F6]">
                        {l.action}
                      </td>
                      <td className="px-4 py-3 max-w-xs sm:max-w-md text-slate-700 font-medium truncate">{l.details}</td>
                      <td className="px-4 py-3 font-mono text-slate-500 font-medium whitespace-nowrap">
                        {l.ipAddress || "127.0.0.1"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Bar */}
          <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <b>{sortedLogs.length === 0 ? 0 : startIndex + 1}</b> to <b>{Math.min(startIndex + pageSize, sortedLogs.length)}</b> of <b>{sortedLogs.length}</b> Audit Entries
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
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
