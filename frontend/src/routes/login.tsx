import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Briefcase, ShieldCheck, ArrowRight, Loader2, Lock, BadgeCheck, Network, Layers, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n";

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

const fieldClass =
  "mt-1 w-full rounded-md border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#0F172A] outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]";

function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [roleId, setRoleId] = useState<"citizen" | "officer" | "admin">("officer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, tText } = useLanguage();

  const roles = [
    {
      id: "citizen",
      label: t.citizenPortal,
      desc: "Report & track civic infrastructure issues",
      icon: User,
      to: "/citizen",
    },
    {
      id: "officer",
      label: t.departmentDashboard,
      desc: "Manage projects, conflicts & resources",
      icon: Briefcase,
      to: "/officer",
    },
    {
      id: "admin",
      label: t.municipalCommandCenter,
      desc: "City-wide analytics & sanction approval",
      icon: ShieldCheck,
      to: "/admin",
    },
  ] as const;

  const currentRole = roles.find((r) => r.id === roleId) || roles[1];

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
      navigate({ to: currentRole.to });
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
    if ((roleId === "officer" || roleId === "admin") && !regEmployeeId.trim()) {
      toast.error(
        roleId === "officer"
          ? "Employee ID (Emp ID) is required to verify official department authorization."
          : "Admin Clearance Code / Emp ID is required for Administrator registration."
      );
      return;
    }
    if (roleId === "citizen" && regPhone && !/^[6-9]\d{9}$/.test(regPhone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setLoading(true);
    try {
      const user = await authApi.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: roleId.toUpperCase(),
        department: roleId === "citizen" ? "PUBLIC" : regDepartment,
        employeeId: regEmployeeId,
        phone: regPhone,
      });
      sessionStorage.setItem("user", JSON.stringify(user));
      toast.success("Account created successfully!");
      navigate({ to: currentRole.to });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#FFFFFF]">
      {/* Left Branding Panel */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-[#0F172A] text-white relative overflow-hidden border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/30 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1E3A8A] text-white font-black text-sm shadow-md">
              UP
            </div>
            <div>
              <span className="font-black text-[#FFFFFF] text-base tracking-wide block">
                {t.appName}
              </span>
              <span className="text-[10px] text-[#3B82F6] font-extrabold uppercase tracking-wider block">
                Infrastructure OS
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 font-bold text-xs py-1 px-3">
            Official E-Governance Authentication
          </Badge>

          <h2 className="text-3xl font-black leading-tight text-white">
            {tText("Intelligent Smart City Infrastructure & Governance Platform")}
          </h2>

          <p className="text-slate-300 text-xs font-normal leading-relaxed">
            Secure multi-role portal for Citizens, Department Officers, and Municipal Administrators.
          </p>

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
          <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> © 2026 {t.appName} · Municipal Governance Platform
        </p>
      </div>

      {/* Right Login / Register Card */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-[#FFFFFF] relative">
        {/* Language Switcher Top Corner */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md space-y-6">
          <Link to="/" className="flex items-center gap-2.5 md:hidden mb-6">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#1E3A8A] text-white font-black">
              UP
            </div>
            <span className="font-extrabold text-[#0F172A]">{t.appName}</span>
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
                "flex-1 rounded-md py-2 text-xs font-bold transition-all cursor-pointer",
                tab === "login"
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              {t.signIn}
            </button>
            <button
              onClick={() => setTab("register")}
              className={cn(
                "flex-1 rounded-md py-2 text-xs font-bold transition-all cursor-pointer",
                tab === "register"
                  ? "bg-[#1E3A8A] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              Register New Account
            </button>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <p className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
              Select Your Access Level
            </p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                const selected = roleId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRoleId(r.id as any)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all cursor-pointer",
                      selected
                        ? "border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A] ring-1 ring-[#1E3A8A]"
                        : "border-[#E2E8F0] bg-[#FFFFFF] text-slate-600 hover:bg-[#F8FAFC]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-bold leading-snug">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          {tab === "login" ? (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Email Address / User ID</label>
                <input
                  type="email"
                  placeholder="e.g. officer@smartcity.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs py-2.5 shadow-sm gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                {t.signIn} as {currentRole.label}
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sattanathan R"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  placeholder="name@smartcity.gov.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input
                  type="password"
                  placeholder="Create strong password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className={fieldClass}
                />
              </div>

              {roleId !== "citizen" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Employee ID / Clearance Code</span>
                    <span className="text-[10px] text-red-500 font-extrabold">* Required</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-2026-88"
                    value={regEmployeeId}
                    onChange={(e) => setRegEmployeeId(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              )}

              {roleId === "citizen" && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="10-digit phone number"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              )}

              {roleId === "officer" && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Department Division</label>
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="Road">Road Infrastructure Division</option>
                    <option value="Water">Water Supply & Sewerage Board</option>
                    <option value="Electricity">Electricity Board</option>
                    <option value="Storm Water">Storm Water Drainage Authority</option>
                    <option value="Telecom">IT & Telecommunications</option>
                  </select>
                </div>
              )}

              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-[#16A34A] hover:bg-[#16A34A]/90 text-white font-bold text-xs py-2.5 shadow-sm gap-2 mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Complete Registration
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
