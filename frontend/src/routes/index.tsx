import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Building2,
  ShieldAlert,
  Users,
  BrainCircuit,
  ArrowRight,
  Network,
  Map,
  Cpu,
  Lock,
  Zap,
  TrendingUp,
  FileText,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Activity,
  Bell,
  Megaphone,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroCity from "@/assets/hero-city.jpg";
import { useLanguage, LanguageSwitcher } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "URBAN PULSE — Intelligent Smart City Infrastructure & Governance Platform",
      },
      {
        name: "description",
        content:
          "Unified municipal platform for infrastructure coordination, spatial conflict analysis, priority scoring, and citizen grievance resolution.",
      },
    ],
  }),
  component: UniqueLandingPage,
});

// Announcements / Notice Board Ticker Items
const ANNOUNCEMENTS = [
  { id: 1, type: "TENDER", tag: "Tender Notice", text: "Sector 4 Underground Drainage Pipeline Expansion Tender Published (Ref: #UP-SMC-2026-089)." },
  { id: 2, type: "SYSTEM", tag: "System Update", text: "Inter-Departmental Spatial Conflict Coordination Service v2.4 Active across all 7 Municipal Zones." },
  { id: 3, type: "MEETING", tag: "Review Schedule", text: "Quarterly Municipal Infrastructure Coordination Review Meeting scheduled for 28th July 2026." },
  { id: 4, type: "POLICY", tag: "Department Directive", text: "Mandatory Joint GIS Trenching Audit enforced for Road & Water Excavations in Zone 5." },
];

export function UniqueLandingPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const { t, tText } = useLanguage();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateTime();
  }, []);

  const STATS = [
    { value: "1,200+", label: tText("Projects Managed"), desc: "Across 7 Municipal Zones", icon: Building2 },
    { value: "18", label: tText("Government Departments"), desc: "Inter-connected Divisions", icon: Network },
    { value: "50,000+", label: tText("Citizens Served"), desc: "Civic Grievances Resolved", icon: Users },
    { value: "92%", label: tText("Conflict Prevention Rate"), desc: "Municipal Coordination", icon: BrainCircuit },
    { value: "250+", label: tText("Conflicts Prevented"), desc: "Spatial & Timeline Clashes", icon: ShieldAlert },
    { value: "35%", label: tText("Faster Execution"), desc: "Inter-Agency Optimization", icon: Zap },
  ];

  const CITIZEN_SERVICES = [
    { title: tText("Submit Grievance"), desc: "Register road damage, water leaks, or street light issues directly to municipal departments.", icon: Megaphone, link: "/login" },
    { title: tText("Track Complaint"), desc: "Track real-time resolution status using your unique Tracking Identifier.", icon: Search, link: "/login" },
    { title: tText("View Public Projects"), desc: "Inspect active and sanctioned infrastructure projects across your municipal zone.", icon: Map, link: "/login" },
    { title: tText("Infrastructure Proposals"), desc: "Submit civic infrastructure improvement proposals for officer review.", icon: Building2, link: "/login" },
    { title: tText("Emergency Helpline Portal"), desc: "Access 24/7 municipal emergency helpline numbers for water burst or power outages.", icon: Phone, link: "/login" },
    { title: tText("Download Reports"), desc: "Access official public infrastructure audit reports and monthly performance summaries.", icon: FileText, link: "/login" },
  ];

  const RECENT_PROJECTS = [
    { id: "PRJ-2026-101", name: "Sector 4 Metro Line 3 Drainage Duct Relocation", dept: "Water Supply & Drainage", status: t.sanctioned, priority: "HIGH", timeline: "90 Days" },
    { id: "PRJ-2026-102", name: "Anna Salai Arterial Underground Fiber Cable Laying", dept: "IT & Telecommunications", status: t.active, priority: "HIGH", timeline: "60 Days" },
    { id: "PRJ-2026-103", name: "Zone 3 Stormwater Channel Excavation & Trenching", dept: "Roads & Storm Water", status: t.pendingApproval, priority: "MEDIUM", timeline: "120 Days" },
    { id: "PRJ-2026-104", name: "Central Substation Power Line Overhead Shift", dept: "Electricity Board", status: t.sanctioned, priority: "HIGH", timeline: "45 Days" },
    { id: "PRJ-2026-105", name: "Sector 7 Bio-Waste Treatment Plant Pipeline", dept: "Waste Management", status: t.active, priority: "LOW", timeline: "150 Days" },
  ];

  return (
    <div
      className={`min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans antialiased selection:bg-[#1E3A8A] selection:text-white scroll-smooth ${
        fontSize === "large" ? "text-base" : fontSize === "xlarge" ? "text-lg" : "text-sm"
      }`}
    >
      {/* 1. SLEEK TOP UTILITY HEADER */}
      <div className="bg-[#0F172A] text-slate-300 py-2 px-4 md:px-8 text-xs font-semibold border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="font-bold text-white tracking-wide">{t.appName}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-medium hidden sm:inline">{t.commandCenterOS}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="hidden md:inline text-slate-300">{currentDate}</span>
            <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
              <LanguageSwitcher />
            </div>
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-700 pl-3 text-[10px]">
              <button onClick={() => setFontSize("normal")} className="hover:text-white font-bold px-1 text-slate-400">A-</button>
              <button onClick={() => setFontSize("normal")} className="hover:text-white font-bold px-1 text-white">A</button>
              <button onClick={() => setFontSize("large")} className="hover:text-white font-bold px-1 text-slate-400">A+</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#FFFFFF]/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1E3A8A] text-white font-black text-sm shadow-md">
              UP
            </div>
            <div>
              <span className="font-black text-base text-[#0F172A] tracking-wide block leading-tight">
                {t.appName}
              </span>
              <span className="text-[10px] text-[#3B82F6] font-extrabold uppercase tracking-wider block">
                Infrastructure OS
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-700">
            <a href="#home" className="hover:text-[#1E3A8A] transition-colors">{tText("Home")}</a>
            <a href="#services" className="hover:text-[#1E3A8A] transition-colors">{tText("Services")}</a>
            <a href="#directory" className="hover:text-[#1E3A8A] transition-colors">{tText("Public Directory")}</a>
            <a href="#contact" className="hover:text-[#1E3A8A] transition-colors">{tText("Contact")}</a>
          </nav>

          {/* Auth Action Buttons - Sign In Only */}
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs px-5 shadow-sm gap-1.5">
              <Link to="/login">
                <Lock className="h-3.5 w-3.5" /> {t.signIn}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section id="home" className="relative bg-[#0F172A] text-white py-16 md:py-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/40 to-transparent pointer-events-none" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-8 relative z-10">
          {/* Left Column */}
          <div className="space-y-5">
            <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 font-bold text-xs py-1 px-3">
              <Activity className="h-3.5 w-3.5 mr-1.5 text-[#3B82F6]" /> {tText("Municipal Infrastructure Command System")}
            </Badge>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl text-white">
              {tText("Intelligent Smart City Infrastructure & Governance Platform")}
            </h1>

            <h2 className="text-sm sm:text-base font-bold text-[#3B82F6] leading-snug">
              {tText("Empowering Urban Governance through AI-Based Predictive Analytics & Inter-Departmental Data Interoperability")}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
              A unified digital platform enabling government departments to collaborate efficiently, predict infrastructure conflicts, prioritize public projects using Artificial Intelligence, and deliver transparent citizen-centric governance.
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-extrabold text-xs sm:text-sm px-8 shadow-md gap-2">
                <Link to="/login">
                  {tText("Sign In to Access System")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#16A34A]">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" /> {t.aiDecisionSupport}
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#3B82F6]">
                <CheckCircle2 className="h-4 w-4 text-[#3B82F6]" /> {t.gisSpatialMap}
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#F59E0B]">
                <CheckCircle2 className="h-4 w-4 text-[#F59E0B]" /> Risk Factor Analysis
              </div>
            </div>
          </div>

          {/* Right Column Banner Image */}
          <div className="relative">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl overflow-hidden relative">
              <img
                src={heroCity}
                width={1280}
                height={960}
                alt="Smart Infrastructure Command City Banner"
                className="rounded-lg w-full object-cover max-h-[420px]"
              />
              <div className="mt-3 p-3 rounded bg-[#1E3A8A] text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#3B82F6] animate-pulse" />
                  <span className="font-bold">Inter-Department Spatial Coordination</span>
                </div>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded font-bold">AUTHENTICATION REQUIRED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ANNOUNCEMENTS TICKER */}
      <section className="bg-[#F8FAFC] py-4 border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1E3A8A] text-white px-3 py-1 rounded font-extrabold text-xs shrink-0">
              <Bell className="h-4 w-4" /> OFFICIAL NOTICES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className="p-2.5 rounded border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-xs space-y-1">
                  <span className="font-extrabold text-[10px] text-[#1E3A8A] uppercase tracking-wider block">
                    {a.tag}
                  </span>
                  <p className="text-slate-700 font-medium line-clamp-2">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. OPERATIONAL IMPACT METRICS */}
      <section className="py-14 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20 font-bold text-xs">
              {tText("System Impact")}
            </Badge>
            <h2 className="text-2xl font-black text-[#0F172A]">{tText("Operational Impact Metrics")}</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Live indicators monitored across municipal infrastructure deployments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center shadow-sm hover:border-[#1E3A8A] transition-all"
              >
                <div className="grid h-9 w-9 place-items-center rounded bg-[#FFFFFF] border border-[#E2E8F0] mx-auto text-[#1E3A8A] mb-2">
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-black text-[#0F172A]">{s.value}</p>
                <p className="mt-1 text-xs font-bold text-[#1E3A8A]">{s.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-500 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SERVICES OVERVIEW */}
      <section id="services" className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/40 font-bold text-xs">
              Public & Officer Services
            </Badge>
            <h2 className="text-2xl font-black text-[#0F172A]">{tText("Citizen & Department Services")}</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Sign in with your credentials to access municipal services, file grievances, and manage projects.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CITIZEN_SERVICES.map((cs) => (
              <div
                key={cs.title}
                className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm hover:shadow-md hover:border-[#1E3A8A] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="grid h-10 w-10 place-items-center rounded bg-[#1E3A8A] text-white">
                    <cs.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">{cs.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{cs.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:text-[#3B82F6]">
                    <Lock className="h-3 w-3" /> Login to Access Service <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST PROJECTS DIRECTORY TABLE */}
      <section id="directory" className="py-16 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20 font-bold text-xs mb-1">
                Official Directory
              </Badge>
              <h2 className="text-2xl font-black text-[#0F172A]">{tText("Recent Infrastructure Works Directory")}</h2>
            </div>
            <Button asChild size="sm" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-bold text-xs">
              <Link to="/login">{tText("Login to View Directory")}</Link>
            </Button>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left text-[#0F172A]">
              <thead className="bg-[#1E3A8A] text-white uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="px-4 py-3">{tText("Project Ref ID")}</th>
                  <th className="px-4 py-3">{tText("Infrastructure Work Title")}</th>
                  <th className="px-4 py-3">{tText("Department Division")}</th>
                  <th className="px-4 py-3">{tText("Status")}</th>
                  <th className="px-4 py-3">{tText("Priority")}</th>
                  <th className="px-4 py-3">{tText("Timeline")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-[#FFFFFF]">
                {RECENT_PROJECTS.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="px-4 py-3 font-mono font-bold text-[#1E3A8A]">{p.id}</td>
                    <td className="px-4 py-3 font-extrabold">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">{p.dept}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === t.sanctioned ? "bg-[#16A34A]/15 text-[#16A34A]" :
                        p.status === t.active ? "bg-[#3B82F6]/15 text-[#3B82F6]" :
                        "bg-[#F59E0B]/15 text-[#F59E0B]"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0F172A]">{p.priority}</td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{p.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION */}
      <section className="bg-[#0F172A] text-white py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-8 text-center space-y-6">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-bold text-xs">
            Municipal System Clearance Required
          </Badge>

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Building Smarter Cities Through Artificial Intelligence
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Please log in with your credentials to access system features, file grievance reports, or review department project predictions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-extrabold text-xs sm:text-sm px-8 shadow-md gap-2">
              <Link to="/login">
                {tText("Sign In to Access System")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer id="contact" className="bg-[#0B132B] text-slate-300 py-12 border-t border-slate-800 text-xs">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded bg-[#1E3A8A] text-white font-black text-base border border-slate-700">
                  UP
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">{t.appName}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Command Center OS</span>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Intelligent Smart City Management System Using AI-Based Predictive Analytics and Inter-Departmental Data Interoperability.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                <li><a href="#home" className="hover:text-white transition">{tText("Home")}</a></li>
                <li><a href="#services" className="hover:text-white transition">{tText("Services")}</a></li>
                <li><a href="#directory" className="hover:text-white transition">{tText("Public Directory")}</a></li>
                <li><Link to="/login" className="hover:text-white transition">{t.signIn}</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Municipal Divisions</h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                <li>Road Infrastructure Division</li>
                <li>Water Supply & Sewerage Board</li>
                <li>Electricity & Power Grid Division</li>
                <li>Storm Water Drainage Authority</li>
                <li>Solid Waste Management Board</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Command Center Contact</h4>
              <div className="space-y-1.5 text-slate-300 font-medium">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#3B82F6]" /> Municipal Command HQ, Sector 4
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#3B82F6]" /> helpdesk@smartcity.gov.in
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#3B82F6]" /> 1800-425-7000 (Helpline)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© 2026 {t.appName} · All Rights Reserved.</p>
            <p className="text-slate-300 font-semibold">
              Developed as an AI-Powered Smart City Infrastructure OS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
