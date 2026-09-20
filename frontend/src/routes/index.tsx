import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  ShieldAlert,
  Users,
  BrainCircuit,
  ArrowRight,
  Map,
  Lock,
  Zap,
  Activity,
  Megaphone,
  CheckCircle2,
  FileBarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroCity from "@/assets/hero-city.jpg";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "URBAN PULSE — Intelligent Smart City Infrastructure Platform",
      },
      {
        name: "description",
        content: "Unified municipal platform for AI conflict analysis, priority scoring, and citizen grievance resolution.",
      },
    ],
  }),
  component: MinimalLandingPage,
});

export function MinimalLandingPage() {
  const { t, tText } = useLanguage();

  const STATS = [
    { value: "1,200+", label: tText("Projects Managed"), icon: Building2 },
    { value: "18", label: tText("Departments"), icon: Users },
    { value: "92%", label: tText("AI Conflict Prevention"), icon: BrainCircuit },
    { value: "50k+", label: tText("Grievances Resolved"), icon: ShieldAlert },
  ];

  const CORE_SERVICES = [
    { title: tText("Citizen Grievance Portal"), desc: tText("Report issues with AI media forgery detection & track real-time resolution."), icon: Megaphone },
    { title: tText("AI Conflict Interceptor"), desc: tText("XGBoost models predict overlapping road, water, and power construction projects."), icon: BrainCircuit },
    { title: tText("GIS Spatial Analytics"), desc: tText("Interactive OpenStreetMap spatial layers, conflict zones, and heatmaps."), icon: Map },
    { title: tText("Executive Intelligence"), desc: tText("Recharts analytics, SHAP feature importance, and downloadable PDF/Excel reports."), icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col justify-between">
      {/* Sleek Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#1E3A8A] text-white font-black text-xs shadow-xs">
              UP
            </div>
            <div>
              <span className="font-black text-base text-[#0F172A] tracking-tight block leading-none">
                URBAN PULSE
              </span>
              <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-wider block mt-0.5">
                {tText("Smart Infrastructure OS")}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button asChild size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs px-5 shadow-xs gap-1.5">
              <Link to="/login">
                <Lock className="h-3.5 w-3.5" /> {t.signIn}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Minimal Hero Section */}
      <main className="flex-1">
        <section className="relative bg-[#0F172A] text-white py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/30 to-transparent pointer-events-none" />

          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 font-bold text-xs py-1 px-3">
                <Activity className="h-3.5 w-3.5 mr-1.5" /> {tText("Next-Gen Urban Governance Platform")}
              </Badge>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                {tText("AI-Driven Infrastructure Coordination & Citizen Services")}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
                {tText("Streamlining inter-departmental workflows, predicting spatial conflicts, scoring project priorities, and verifying civic grievance media with deep learning.")}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-black text-sm px-8 shadow-md gap-2">
                  <Link to="/login">
                    {tText("Access Municipal Portal")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Minimal Stats Strip */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800">
                {STATS.map((s, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-2xl font-black text-white">{s.value}</p>
                    <p className="text-xs font-bold text-[#3B82F6]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl overflow-hidden relative group">
                <img
                  src={heroCity}
                  alt="Smart Infrastructure City"
                  className="rounded-xl w-full object-cover max-h-[380px]"
                />
                <div className="absolute bottom-6 left-6 right-6 p-3 rounded-lg bg-[#0F172A]/90 backdrop-blur-md border border-slate-700 text-white flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#3B82F6]" /> {tText("Active Interoperability Engine")}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Core Services */}
        <section className="py-16 max-w-7xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-[#0F172A]">{tText("Core Platform Modules")}</h2>
            <p className="text-xs font-semibold text-slate-500">
              {tText("Integrated infrastructure coordination for citizens, officers, and municipal leadership.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_SERVICES.map((s, i) => (
              <div key={i} className="p-6 rounded-xl border border-[#E2E8F0] bg-white shadow-xs hover:border-[#1E3A8A] transition-all space-y-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#1E3A8A]">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">{s.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Clean Multi-Column Footer */}
      <footer className="border-t border-[#E2E8F0] bg-[#0F172A] text-slate-300 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Tagline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#3B82F6] text-white font-black text-xs">
                  UP
                </div>
                <div>
                  <span className="font-black text-sm text-white tracking-tight block">URBAN PULSE</span>
                  <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-wider block">{tText("Smart Infrastructure OS")}</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                {tText("Unified Municipal Infrastructure Platform powered by AI Predictive Analytics, Deep Learning Media Verification & GIS Spatial Mapping.")}
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">{tText("Quick Access")}</h4>
              <ul className="space-y-1.5 font-medium text-slate-400">
                <li><Link to="/login" className="hover:text-white transition">{tText("Citizen Grievance Portal")}</Link></li>
                <li><Link to="/login" className="hover:text-white transition">{tText("GIS Spatial Conflict Map")}</Link></li>
                <li><Link to="/login" className="hover:text-white transition">{tText("Executive Analytics & Reports")}</Link></li>
                <li><Link to="/login" className="hover:text-white flex items-center gap-1 font-bold text-[#3B82F6] transition">{tText("Sign In to Command Center →")}</Link></li>
              </ul>
            </div>

            {/* Col 3: Municipal Divisions */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">{tText("Departments")}</h4>
              <ul className="space-y-1.5 font-medium text-slate-400">
                <li>{tText("Road Infrastructure Division")}</li>
                <li>{tText("Water Supply & Sewage Board")}</li>
                <li>{tText("Electricity & Power Operations")}</li>
                <li>{tText("Solid Waste & Sanitation Dept")}</li>
              </ul>
            </div>

            {/* Col 4: Helpdesk Contact */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">{tText("Command Helpline")}</h4>
              <ul className="space-y-1.5 font-medium text-slate-400">
                <li className="flex items-center gap-2">📍 {tText("Municipal Command HQ, Sector 4")}</li>
                <li className="flex items-center gap-2">📞 Toll-Free: 1800-425-7000</li>
                <li className="flex items-center gap-2">✉️ support@smartcity.gov.in</li>
                <li className="text-[10px] text-emerald-400 font-bold">● {tText("24/7 Emergency Dispatch Active")}</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] font-medium">
            <p>© 2026 URBAN PULSE · {tText("Smart City AI Governance Platform. All Rights Reserved.")}</p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-white cursor-pointer transition">{tText("Privacy Policy")}</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer transition">{tText("Terms of Service")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
