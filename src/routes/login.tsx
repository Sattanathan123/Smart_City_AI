import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Briefcase, ShieldCheck, ArrowRight, Loader2, Lock, BadgeCheck, Network, Layers, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "System Sign In — URBAN PULSE Platform" },
      {
        name: "description",
        content: "Sign in or register as a Citizen, Department Officer, or Administrator.",
      },
    ],
  }),
  component: LoginPage,
});

const roles = [
  {
    id: "citizen",
    label: "Citizen Portal",
    desc: "Report & track civic infrastructure issues",
    icon: User,
    to: "/citizen",
  },
  {
    id: "officer",
    label: "Department Officer",
    desc: "Manage projects, conflicts & resources",
    icon: Briefcase,
    to: "/officer",
  },
  {
    id: "admin",
    label: "Administrator",
    desc: "City-wide analytics & sanction approval",
    icon: ShieldCheck,
    to: "/admin",
  },
] as const;

const fieldClass =
  "mt-1 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]";

function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<(typeof roles)[number]>(roles[1]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmployeeId, setRegEmployeeId] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDepartment, setRegDepartment] = useState("Road");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await authApi.login({ email, password });
      sessionStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome, ${user.name}!`);
      navigate({ to: role.to });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPassword) {
      toast.error("Please fill all required fields");
      return;
    }
    if ((role.id === "officer" || role.id === "admin") && !regEmployeeId.trim()) {
      toast.error(
        role.id === "officer"
          ? "Employee ID (Emp ID) is required to verify official department authorization."
          : "Admin Clearance Code / Emp ID is required for Administrator registration."
      );
      return;
    }
    if (role.id === "citizen" && regPhone && !/^[6-9]\d{9}$/.test(regPhone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        employeeId: regEmployeeId,
        ...(role.id === "citizen" && regPhone ? { phone: regPhone } : {}),
        department: regDepartment,
        role: role.id,
      });
      toast.success("Registration successful! Official credentials saved. Please sign in.");
      setEmail(regEmail);
      setPassword(regPassword);
      setTab("login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2 bg-[#FFFFFF] text-[#0F172A]">
      {/* Left Creative Executive Banner */}
      <div className="hidden flex-col justify-between bg-[#0F172A] p-12 text-white md:flex border-r border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/50 via-transparent to-[#0B132B] pointer-events-none" />
        
        {/* Header Branding */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#3B82F6] text-white font-black shadow-md">
            UP
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide text-white block">URBAN PULSE</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Command OS</span>
          </div>
        </Link>

        {/* Center Creative Content Card */}
        <div className="relative z-10 space-y-6">
          <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 font-bold text-xs py-1 px-3">
            <Shield className="h-3.5 w-3.5 mr-1.5" /> Official Governance Authentication
          </Badge>

          <div className="space-y-3">
            <h2 className="text-3xl font-black leading-tight text-white tracking-wide">
              Smart City Infrastructure Co-Ordination Command OS
            </h2>
            <p className="max-w-md text-slate-300 text-xs font-medium leading-relaxed">
              Unified inter-departmental platform connecting Road, Water, Electricity, Drainage, and Waste Management divisions with official employee verification.
            </p>
          </div>

          {/* Interactive Feature Cards */}
          <div className="space-y-2.5 pt-2">
            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-200 font-semibold">
                <BadgeCheck className="h-4 w-4 text-[#3B82F6]" /> Employee ID Verification
              </span>
              <Badge className="bg-[#3B82F6]/20 text-[#3B82F6] font-bold text-[10px]">Active Protocol</Badge>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-200 font-semibold">
                <Network className="h-4 w-4 text-[#16A34A]" /> 5 Municipal Divisions
              </span>
              <Badge className="bg-[#16A34A]/20 text-[#16A34A] font-bold text-[10px]">Road · Water · Power · Sewer</Badge>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-200 font-semibold">
                <Layers className="h-4 w-4 text-[#F59E0B]" /> 7 City Zones Synchronized
              </span>
              <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] font-bold text-[10px]">Command Ready</Badge>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-400 font-medium relative z-10 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> © 2026 URBAN PULSE · Municipal Governance Platform
        </p>
      </div>

      {/* Right Login / Register Card */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-[#FFFFFF]">
        <div className="w-full max-w-md space-y-6">
          <Link to="/" className="flex items-center gap-2.5 md:hidden mb-6">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#1E3A8A] text-white font-black">
              UP
            </div>
            <span className="font-extrabold text-[#0F172A]">URBAN PULSE</span>
          </Link>

          {/* Header text */}
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-[#0F172A] flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#1E3A8A]" /> Account Authentication
            </h1>
            <p className="text-xs text-slate-600 font-semibold">
              Sign in with your registered municipal credentials or employee clearance ID.
            </p>
          </div>

          {/* Tab Switch */}
          <div className="flex rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-1">
            <button
              onClick={() => setTab("login")}
              className={cn(
                "flex-1 rounded-md py-2 text-xs font-bold transition-all",
                tab === "login"
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("register")}
              className={cn(
                "flex-1 rounded-md py-2 text-xs font-bold transition-all",
                tab === "register"
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              Register New Account
            </button>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#0F172A]">Select Authorization Role</label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map((r) => {
                const active = role.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex items-center gap-3 rounded-md border p-3 text-left transition-all",
                      active
                        ? "border-[#1E3A8A] bg-[#1E3A8A]/5 ring-1 ring-[#1E3A8A]"
                        : "border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC]"
                    )}
                  >
                    <div
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-md font-bold text-xs",
                        active ? "bg-[#1E3A8A] text-white" : "bg-[#F1F5F9] text-[#0F172A]"
                      )}
                    >
                      <r.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A]">{r.label}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Official Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@smartcity.gov.in"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={fieldClass}
                />
              </div>
              <Button
                className="mt-3 w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-extrabold text-xs h-10 shadow-sm"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign In as {role.label} <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Full Name *</label>
                <input
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Sattanathan"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#0F172A]">Official Email Address *</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. officer@smartcity.gov.in"
                  className={fieldClass}
                />
              </div>

              {/* Employee ID (Emp ID) Field for Department Officer & Admin */}
              {role.id === "officer" && (
                <div>
                  <label className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#1E3A8A]" /> Employee ID (Emp ID) *
                  </label>
                  <input
                    value={regEmployeeId}
                    onChange={(e) => setRegEmployeeId(e.target.value)}
                    placeholder="e.g. EMP-1048 (Required for Officer Verification)"
                    className={fieldClass}
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    Official department employee number used for identity verification.
                  </span>
                </div>
              )}

              {role.id === "admin" && (
                <div>
                  <label className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#1E3A8A]" /> Admin Clearance Code / Emp ID *
                  </label>
                  <input
                    value={regEmployeeId}
                    onChange={(e) => setRegEmployeeId(e.target.value)}
                    placeholder="e.g. ADM-9901 (Required for Admin Clearance)"
                    className={fieldClass}
                    required
                  />
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    Govt clearance code for executive sanction authorization.
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#0F172A]">Password *</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className={fieldClass}
                />
              </div>

              {(role.id === "officer" || role.id === "admin") && (
                <div>
                  <label className="text-xs font-bold text-[#0F172A]">Department *</label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className={fieldClass}
                  >
                    {[
                      "Road",
                      "Water",
                      "Electricity",
                      "Drainage",
                      "Waste Management",
                      "Admin",
                    ].map((d) => (
                      <option key={d} value={d} className="bg-white text-[#0F172A]">{d}</option>
                    ))}
                  </select>
                </div>
              )}

              <Button
                className="mt-3 w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-extrabold text-xs h-10 shadow-sm"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Complete Registration as {role.label} <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
