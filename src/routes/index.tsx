import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  ArrowRight,
  Network,
  BarChart3,
  Map,
  Flame,
  Cpu,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroCity from "@/assets/hero-city.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "URBAN PULSE — Smart Infrastructure Co-Ordination & Command Platform" },
      {
        name: "description",
        content:
          "Unified municipal platform for inter-departmental project coordination, geospatial mapping, and resource optimization.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: ShieldAlert,
    title: "Predictive Conflict Detection Engine",
    desc: "Identifies spatial, timeline, and resource overlaps across municipal departments before excavation work begins.",
    tag: "Module 2 & 3",
  },
  {
    icon: Map,
    title: "Interactive OpenStreetMap GIS Map",
    desc: "Live geospatial mapping of municipal projects with department filtering and popup attribute inspection.",
    tag: "Module 4",
  },
  {
    icon: Flame,
    title: "Spatial Overlap Risk Heat Map",
    desc: "Visualizes high-density infrastructure overlap hotspots and radial risk gradients across 7 city zones.",
    tag: "Module 5",
  },
  {
    icon: Cpu,
    title: "Resource Allocation & Optimization Engine",
    desc: "Constrained linear optimization model re-balancing heavy machinery and structural engineers to eliminate bottlenecks.",
    tag: "Module 6",
  },
  {
    icon: BarChart3,
    title: "Executive Analytics & PDF Exporter",
    desc: "Comprehensive Recharts analytics dashboard with one-click Excel CSV export and print-ready PDF reports.",
    tag: "Module 1 & 7",
  },
  {
    icon: ShieldCheck,
    title: "Security Audit & Access Logs",
    desc: "Immutable system access logging tracking user actions, sanction approvals, and officer activities.",
    tag: "Module 8",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F172A] selection:bg-[#3B82F6] selection:text-white">
      {/* Top Navigation Header - Login Button Only */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1E3A8A] text-white font-black shadow-sm">
              UP
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#0F172A] tracking-wide">URBAN PULSE</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Infrastructure Command OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs px-5 shadow-sm gap-1.5">
              <Link to="/login">
                <Lock className="h-3.5 w-3.5" /> Sign In / Login
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[#0F172A] text-white py-16 md:py-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/50 to-transparent pointer-events-none" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8 relative z-10">
          <div>
            <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 font-bold text-xs py-1 px-3 mb-4">
              <Network className="h-3.5 w-3.5 mr-1.5" /> Municipal Corporation Governance OS
            </Badge>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl text-white">
              Smart Infrastructure Co-Ordination & Urban Intelligence Platform
            </h1>

            <p className="mt-4 text-sm text-slate-300 sm:text-base font-medium leading-relaxed">
              Connecting Road, Water, Electricity, Drainage, and Waste Management departments under one real-time predictive spatial intelligence platform. Please sign in to access all system modules.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-extrabold text-sm px-8 shadow-md gap-2">
                <Link to="/login">
                  Sign In to Access System <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
              <div>
                <span className="block font-black text-xl text-[#3B82F6]">7 Zones</span>
                <span className="text-slate-400 font-semibold">Municipal Sectors</span>
              </div>
              <div>
                <span className="block font-black text-xl text-[#16A34A]">5 Depts</span>
                <span className="text-slate-400 font-semibold">Synchronized</span>
              </div>
              <div>
                <span className="block font-black text-xl text-[#F59E0B]">99.4%</span>
                <span className="text-slate-400 font-semibold">Model Accuracy</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl overflow-hidden">
              <img
                src={heroCity}
                width={1280}
                height={960}
                alt="Smart Infrastructure Command Map"
                className="rounded-lg w-full object-cover max-h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid - Login Prompt Required */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 bg-[#FFFFFF]">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20 font-bold text-xs">
            Integrated System Architecture
          </Badge>
          <h2 className="text-3xl font-black tracking-tight text-[#0F172A]">Core Infrastructure Control Modules</h2>
          <p className="text-slate-600 text-sm font-semibold">
            Sign in with your officer or administrator account to view and manage all modules.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#3B82F6]/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1E3A8A] text-white">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold border-[#E2E8F0] text-[#0F172A] bg-white">
                    {f.tag}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">{f.title}</h3>
                <p className="mt-2 text-xs text-slate-700 font-medium leading-relaxed">{f.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1E3A8A] hover:text-[#3B82F6] transition"
                >
                  <Lock className="h-3 w-3" /> Login to View Module <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Access Authentication Card */}
      <section className="bg-[#F8FAFC] border-y border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-8 text-center space-y-6">
          <Badge variant="outline" className="bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/30 font-bold text-xs">
            Role-Based Authentication Required
          </Badge>
          <h2 className="text-3xl font-black text-[#0F172A]">Authorization Required to Access Command Center</h2>
          <p className="text-slate-700 text-sm font-medium max-w-xl mx-auto">
            System access is restricted to authorized Municipal Officers, Department Admins, and Citizens. Please log in with your credentials to view project data and analytics.
          </p>
          <div>
            <Button asChild size="lg" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-extrabold text-sm px-8 shadow-md gap-2">
              <Link to="/login">
                Proceed to Login Page <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-300 py-8 border-t border-slate-800">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-[#3B82F6] text-white font-black grid place-items-center text-[10px]">
              UP
            </div>
            <span className="text-white font-bold">URBAN PULSE</span> — Smart Infrastructure Co-Ordination System
          </div>
          <p className="text-slate-400 text-center md:text-right font-medium">
            © 2026 URBAN PULSE · Municipal Corporation Infrastructure Governance Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
