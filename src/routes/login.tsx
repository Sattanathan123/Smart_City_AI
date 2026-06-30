import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, User, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — SmartCity OS" },
      { name: "description", content: "Sign in as a Citizen, Department Officer, or Administrator." },
    ],
  }),
  component: LoginPage,
});

const roles = [
  { id: "citizen", label: "Citizen", desc: "Report & track civic issues", icon: User, to: "/citizen" },
  { id: "officer", label: "Department Officer", desc: "Manage projects & resources", icon: Briefcase, to: "/officer" },
  { id: "admin", label: "Administrator", desc: "City-wide analytics & AI", icon: ShieldCheck, to: "/admin" },
] as const;

function LoginPage() {
  const [role, setRole] = useState<(typeof roles)[number]>(roles[1]);
  const navigate = useNavigate();

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
            Citizen civic data, department project data and AI analysis — unified in one
            intelligent platform.
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
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Select your role to continue.</p>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-foreground">Login As</p>
            {roles.map((r) => {
              const active = role.id === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "bg-card hover:bg-accent/40",
                  )}
                >
                  <div
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{r.label}</p>
                    <p className="text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                defaultValue={`${role.id}@smartcity.gov`}
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                defaultValue="demo1234"
                className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={() => navigate({ to: role.to })}
          >
            Continue as {role.label} <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Prototype — no real authentication. Any credentials work.
          </p>
        </div>
      </div>
    </div>
  );
}
