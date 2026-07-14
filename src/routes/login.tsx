import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, User, Briefcase, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — SmartCity OS" },
      { name: "description", content: "Sign in or register as a Citizen, Department Officer, or Administrator." },
    ],
  }),
  component: LoginPage,
});

const roles = [
  { id: "citizen", label: "Citizen", desc: "Report & track civic issues", icon: User, to: "/citizen" },
  { id: "officer", label: "Department Officer", desc: "Manage projects & resources", icon: Briefcase, to: "/officer" },
  { id: "admin", label: "Administrator", desc: "City-wide analytics & AI", icon: ShieldCheck, to: "/admin" },
] as const;

const field = "mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<(typeof roles)[number]>(roles[1]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login state
  const [email, setEmail] = useState("officer@smartcity.gov");
  const [password, setPassword] = useState("demo1234");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
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
        ...(role.id === "citizen" && regPhone ? { phone: regPhone } : {}),
        department: regDepartment,
        role: role.id,
      });
      toast.success("Registered successfully! Please login.");
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
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-hero p-12 text-primary-foreground md:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-foreground/15">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-semibold">SmartCity OS</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Coordinated planning for a smarter city.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Citizen civic data, department project data and AI analysis — unified in one intelligent platform.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">© 2026 SmartCity OS</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2.5 md:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-semibold text-foreground">SmartCity OS</span>
          </Link>

          {/* Tab Switch */}
          <div className="flex rounded-xl border bg-muted p-1 mb-6">
            <button
              onClick={() => setTab("login")}
              className={cn("flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                tab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              Login
            </button>
            <button
              onClick={() => setTab("register")}
              className={cn("flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
                tab === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              Register
            </button>
          </div>

          {/* Role Selector — shared */}
          <div className="space-y-2 mb-5">
            <p className="text-sm font-medium text-foreground">Select Role</p>
            {roles.map((r) => {
              const active = role.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (tab === "login") setEmail(`${r.id}@smartcity.gov`);
                  }}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-3 text-left transition-colors",
                    active ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card hover:bg-accent/40",
                  )}
                >
                  <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <r.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.label}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
              </div>
              <Button className="mt-2 w-full" size="lg" onClick={handleLogin} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Login as {role.label} <ArrowRight className="h-4 w-4" /></>}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                No account?{" "}
                <button onClick={() => setTab("register")} className="text-primary underline">Register here</button>
              </p>
            </div>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="e.g. Arjun Kumar" className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="e.g. arjun@smartcity.gov" className={field} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Password</label>
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Min 6 characters" className={field} />
              </div>
              {role.id === "citizen" && (
                <div>
                  <label className="text-sm font-medium text-foreground">Mobile Number <span className="text-muted-foreground">(optional)</span></label>
                  <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="e.g. 9876543210" maxLength={10} className={field} />
                </div>
              )}
              {(role.id === "officer" || role.id === "admin") && (
                <div>
                  <label className="text-sm font-medium text-foreground">Department</label>
                  <select value={regDepartment} onChange={(e) => setRegDepartment(e.target.value)} className={field}>
                    {["Road", "Water", "Electricity", "Drainage", "Waste Management", "IT", "Admin"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}
              <Button className="mt-2 w-full" size="lg" onClick={handleRegister} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Register as {role.label} <ArrowRight className="h-4 w-4" /></>}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setTab("login")} className="text-primary underline">Login here</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
