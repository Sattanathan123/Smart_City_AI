import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  ShieldAlert,
  Users,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Network,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroCity from "@/assets/hero-city.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartCity OS — AI-Powered Smart City Collaboration Platform" },
      {
        name: "description",
        content:
          "Connecting city departments through intelligent data sharing, predictive analytics, and coordinated urban planning.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: ShieldAlert,
    title: "AI Project Conflict Detection",
    desc: "Automatically detect overlapping locations, timelines, and resource clashes across departments before work begins.",
  },
  {
    icon: Users,
    title: "Department Collaboration",
    desc: "Road, Water, Electricity, Drainage and Waste teams plan together on one shared, real-time platform.",
  },
  {
    icon: BrainCircuit,
    title: "Civic Intelligence",
    desc: "Turn citizen complaints and project data into predictive insights that guide smarter city decisions.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-foreground">SmartCity OS</p>
              <p className="text-xs text-muted-foreground">Civic Intelligence Platform</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <Network className="h-3.5 w-3.5" /> Inter-Departmental Planning
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              AI-Powered Smart City Collaboration Platform
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/80 md:text-lg">
              Connecting city departments through intelligent data sharing, predictive analytics,
              and coordinated urban planning.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/login">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="lg">
                <Link to="/admin">View Live Demo</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> 7 City Zones
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> 5 Departments
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Real-time AI Alerts
              </span>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroCity}
              width={1280}
              height={960}
              alt="Illustration of a connected smart city with glowing data links between departments"
              className="rounded-2xl border border-primary-foreground/15 shadow-elevated"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground">One platform for the whole city</h2>
          <p className="mt-3 text-muted-foreground">
            Citizen civic data + department project data + AI analysis = coordinated smart city
            planning.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-card p-6 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y bg-secondary/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-8">
          {[
            { v: "120", l: "Total Projects" },
            { v: "35", l: "Active Projects" },
            { v: "8", l: "AI Conflicts Detected" },
            { v: "92%", l: "AI Confidence" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-3xl font-extrabold text-primary md:text-4xl">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center md:px-8">
        <BarChart3 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 text-3xl font-bold text-foreground">
          Ready to coordinate your city?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Sign in as a Citizen, Department Officer, or Administrator to explore the prototype.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/login">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground md:flex-row md:px-8">
          <p>© 2026 SmartCity OS — Civic Intelligence Platform</p>
          <p>AI-Powered Smart City Collaboration · Final Year Project Prototype</p>
        </div>
      </footer>
    </div>
  );
}
