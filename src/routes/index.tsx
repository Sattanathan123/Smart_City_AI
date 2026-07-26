import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Building2,
  ShieldAlert,
  Users,
  BrainCircuit,
  ArrowRight,
  Network,
  BarChart3,
  Map,
  Cpu,
  ShieldCheck,
  Globe,
  Lock,
  Zap,
  TrendingUp,
  FileText,
  UserCheck,
  Layers,
  Sparkles,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Check,
  Activity,
  Award,
  Shield,
  Clock,
  AlertCircle,
  Search,
  Bell,
  Megaphone,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroCity from "@/assets/hero-city.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Intelligent Smart City Management System — Government of India Smart City Portal",
      },
      {
        name: "description",
        content:
          "Official Government of India AI Decision Support Platform for Smart Infrastructure Planning, Inter-Departmental Conflict Prevention, and Project Prioritization.",
      },
    ],
  }),
  component: GovernmentLandingPage,
});

// Announcements / Notice Board Ticker Items
const ANNOUNCEMENTS = [
  { id: 1, type: "TENDER", tag: "Tender Notice", text: "Sector 4 Underground Drainage Pipeline Expansion Tender Published (Ref: #GOI-SMC-2026-089)." },
  { id: 2, type: "SYSTEM", tag: "System Update", text: "Inter-Departmental Spatial Conflict XGBoost AI Model v2.4 Deployed across all 7 Municipal Zones." },
  { id: 3, type: "MEETING", tag: "Review Schedule", text: "Quarterly Municipal Infrastructure Coordination Review Meeting scheduled for 28th July 2026." },
  { id: 4, type: "POLICY", tag: "Department Directive", text: "Mandatory Joint GIS Trenching Audit enforced for Road & Water Excavations in Zone 5." },
];

// Impact KPI Statistics
const STATS = [
  { value: "1,200+", label: "Projects Managed", desc: "Across 7 Municipal Zones", icon: Building2 },
  { value: "18", label: "Government Departments", desc: "Inter-connected Divisions", icon: Network },
  { value: "50,000+", label: "Citizens Served", desc: "Civic Grievances Resolved", icon: Users },
  { value: "92%", label: "AI Prediction Accuracy", desc: "XGBoost Classification", icon: BrainCircuit },
  { value: "250+", label: "Conflicts Prevented", desc: "Spatial & Timeline Clashes", icon: ShieldAlert },
  { value: "35%", label: "Faster Project Execution", desc: "Inter-Agency Optimization", icon: Zap },
];

// Citizen Services Tiles
const CITIZEN_SERVICES = [
  { title: "Submit Grievance", desc: "Register road damage, water leaks, or street light issues directly to municipal departments.", icon: Megaphone, link: "/citizen" },
  { title: "Track Complaint", desc: "Track real-time resolution status using your unique 6-digit Tracking Identifier.", icon: Search, link: "/citizen" },
  { title: "View Public Projects", desc: "Inspect active and sanctioned infrastructure projects across your municipal zone.", icon: Map, link: "/login" },
  { title: "Infrastructure Request", desc: "Submit civic infrastructure improvement proposals for review by department officers.", icon: Building2, link: "/login" },
  { title: "Emergency Hotline", desc: "Access 24/7 municipal emergency helpline numbers for water burst or power outages.", icon: Phone, link: "/citizen" },
  { title: "Download Reports", desc: "Access official public infrastructure audit reports and monthly performance summary.", icon: FileText, link: "/login" },
];

// Department Services Tiles
const DEPT_SERVICES = [
  { title: "Project Registration", desc: "Submit new infrastructure works with spatial coordinates, budget, and estimated timeline.", icon: FileSpreadsheet },
  { title: "Conflict Detection", desc: "Automated AI spatial analysis identifying geographic overlaps with adjacent department plans.", icon: ShieldAlert },
  { title: "Priority Prediction", desc: "Machine learning classifier ranking project urgency based on traffic and public impact.", icon: TrendingUp },
  { title: "Resource Allocation", desc: "Linear optimization engine re-balancing heavy machinery and structural engineering workforce.", icon: Cpu },
  { title: "Project Monitoring", desc: "Real-time milestone tracking, budget utilization, and field execution status inspection.", icon: Activity },
  { title: "Approval Requests", desc: "Submit formal sanction documentation to Municipal Administrator for executive clearance.", icon: ShieldCheck },
];

// AI Intelligence Cards
const AI_MODULES = [
  { title: "Spatial Conflict Detection", desc: "Predicts geographic coordinates, excavation depths, and date overlaps to prevent duplicate road digging.", icon: ShieldAlert },
  { title: "Priority Prediction Engine", desc: "Scores project urgency using traffic density, weather risk, and critical asset proximity metrics.", icon: TrendingUp },
  { title: "Explainable AI (SHAP)", desc: "Transparent SHAP attribution graphs explaining the precise parameters driving AI risk classifications.", icon: BrainCircuit },
  { title: "Recommendation Engine", desc: "Generates actionable trench-sharing protocols and schedule adjustments across municipal divisions.", icon: Sparkles },
  { title: "Resource Optimization", desc: "Solves constrained allocation models to share heavy equipment and avoid machinery idle time.", icon: Cpu },
  { title: "GIS Spatial Monitoring", desc: "OpenStreetMap rendering of municipal zones, active worksites, and spatial conflict density heatmaps.", icon: Map },
];

// 10-Step Government Process Flow
const WORKFLOW_STEPS = [
  { step: 1, title: "Citizen Request", dept: "Civic Portal" },
  { step: 2, title: "Department Review", dept: "Officer Inspection" },
  { step: 3, title: "Project Creation", dept: "Gati Shakti Entry" },
  { step: 4, title: "AI Conflict Detection", dept: "Spatial AI Engine" },
  { step: 5, title: "AI Priority Prediction", dept: "ML Classifier" },
  { step: 6, title: "AI Recommendation", dept: "Protocol Generation" },
  { step: 7, title: "Admin Approval", dept: "Executive Sanction" },
  { step: 8, title: "Project Execution", dept: "Ground Work" },
  { step: 9, title: "Citizen Notification", dept: "SMS & Email Alert" },
];

// Government Smart City Highlights
const HIGHLIGHTS = [
  { title: "Digital Governance", desc: "Paperless inter-departmental workflows adhering to Digital India guidelines.", icon: Award },
  { title: "AI Decision Support", desc: "Machine learning analytics guiding municipal resource and project prioritization.", icon: BrainCircuit },
  { title: "Inter-Department Collaboration", desc: "Unified data sharing across Road, Water, Electricity, Drainage, and Waste divisions.", icon: Network },
  { title: "Full Transparency", desc: "Explainable AI attribution graphs ensuring transparent public project sanctions.", icon: Eye },
  { title: "Resource Optimization", desc: "Constrained linear models eliminating equipment downtime and redundant expenditure.", icon: Cpu },
  { title: "Citizen-Centric Services", desc: "Direct grievance tracking, automated updates, and 24/7 municipal helpline support.", icon: Users },
  { title: "Sustainable Development", desc: "Coordinated excavation planning reducing traffic congestion and urban disturbance.", icon: Globe },
];

// Sample Official Government Project Table Data
const RECENT_PROJECTS = [
  { id: "PRJ-2026-101", name: "Sector 4 Metro Line 3 Drainage Duct Relocation", dept: "Water Supply & Drainage", status: "SANCTIONED", priority: "HIGH", timeline: "90 Days" },
  { id: "PRJ-2026-102", name: "Anna Salai Arterial Underground Fiber Cable Laying", dept: "IT & Telecommunications", status: "IN_PROGRESS", priority: "HIGH", timeline: "60 Days" },
  { id: "PRJ-2026-103", name: "Zone 3 Stormwater Channel Excavation & Trenching", dept: "Roads & Storm Water", status: "PENDING_APPROVAL", priority: "MEDIUM", timeline: "120 Days" },
  { id: "PRJ-2026-104", name: "Central Substation Power Line Overhead Shift", dept: "Electricity Board", status: "SANCTIONED", priority: "HIGH", timeline: "45 Days" },
  { id: "PRJ-2026-105", name: "Sector 7 Bio-Waste Treatment Plant Pipeline", dept: "Waste Management", status: "IN_PROGRESS", priority: "LOW", timeline: "150 Days" },
];

export function GovernmentLandingPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

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

  return (
    <div
      className={`min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans antialiased selection:bg-[#0B3D91] selection:text-white scroll-smooth ${
        fontSize === "large" ? "text-base" : fontSize === "xlarge" ? "text-lg" : "text-sm"
      }`}
    >
      {/* 1. TOP SLIM GOVERNMENT HEADER */}
      <div className="bg-[#0B3D91] text-white border-b border-[#0B3D91]/20 py-1.5 px-4 md:px-8 text-xs font-semibold">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base" title="Emblem of India">🇮🇳</span>
            <span className="font-bold tracking-wide">Government of India</span>
            <span className="hidden sm:inline text-blue-200">|</span>
            <span className="hidden sm:inline text-blue-100 font-medium">Ministry of Housing and Urban Affairs</span>
            <span className="hidden lg:inline text-blue-200">|</span>
            <span className="hidden lg:inline text-blue-100 font-medium">Smart City AI Decision Support Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="hidden md:inline text-blue-100">{currentDate}</span>
            <div className="flex items-center gap-1 border-l border-blue-700 pl-3">
              <span className="cursor-pointer hover:underline text-blue-200 font-bold">English</span>
              <span className="text-blue-400">|</span>
              <span className="cursor-pointer hover:underline text-blue-200 font-bold">हिंदी</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 border-l border-blue-700 pl-3 text-[10px]">
              <button onClick={() => setFontSize("normal")} className="hover:text-white font-bold px-1">A-</button>
              <button onClick={() => setFontSize("normal")} className="hover:text-white font-bold px-1">A</button>
              <button onClick={() => setFontSize("large")} className="hover:text-white font-bold px-1">A+</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#FFFFFF] shadow-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo & National Branding */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#0B3D91] text-white font-black text-lg shadow-sm border border-[#1565C0]">
              GOI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-[#0B3D91] tracking-tight">
                  SMART CITIES MISSION
                </span>
                <Badge variant="outline" className="bg-[#FF9933]/15 text-[#FF9933] border-[#FF9933]/40 font-bold text-[9px] py-0 px-1.5">
                  Digital India
                </Badge>
              </div>
              <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                Intelligent Urban Governance OS
              </p>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-extrabold text-[#0F172A]">
            <a href="#home" className="hover:text-[#0B3D91] transition-colors py-1 border-b-2 border-transparent hover:border-[#0B3D91]">Home</a>
            <a href="#about" className="hover:text-[#0B3D91] transition-colors py-1 border-b-2 border-transparent hover:border-[#0B3D91]">About</a>
            <a href="#departments" className="hover:text-[#0B3D91] transition-colors py-1 border-b-2 border-transparent hover:border-[#0B3D91]">Departments</a>
            <a href="#citizen-services" className="hover:text-[#0B3D91] transition-colors py-1 border-b-2 border-transparent hover:border-[#0B3D91]">Citizen Services</a>
            <a href="#ai-platform" className="hover:text-[#0B3D91] transition-colors py-1 border-b-2 border-transparent hover:border-[#0B3D91]">AI Platform</a>
            <a href="#workflow" className="hover:text-[#0B3D91] transition-colors py-1 border-b-2 border-transparent hover:border-[#0B3D91]">Workflow</a>
            <a href="#contact" className="hover:text-[#0B3D91] transition-colors py-1 border-b-2 border-transparent hover:border-[#0B3D91]">Contact</a>
          </nav>

          {/* Login / Register Buttons */}
          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white font-extrabold text-xs px-5 shadow-sm">
              <Link to="/login">Official Login</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0]/10 font-bold text-xs px-4">
              <Link to="/login">Register Portal</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section id="home" className="relative bg-[#FFFFFF] text-[#0F172A] py-12 md:py-16 border-b border-[#E2E8F0]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:px-8">
          {/* Left Column Text */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-md bg-[#0B3D91]/10 border border-[#0B3D91]/20 px-3 py-1 text-xs font-bold text-[#0B3D91]">
              <Shield className="h-3.5 w-3.5 text-[#0B3D91]" /> National Smart City Decision Support Framework
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl text-[#0B3D91]">
              Intelligent Smart City Management System
            </h1>

            <h2 className="text-sm sm:text-base font-bold text-[#1565C0] leading-snug">
              Empowering Urban Governance through AI-Based Predictive Analytics and Inter-Departmental Data Interoperability
            </h2>

            <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed">
              A unified digital platform enabling government departments to collaborate efficiently, predict infrastructure conflicts, prioritize public projects using Artificial Intelligence, and deliver transparent citizen-centric governance.
            </p>

            {/* Portal Direct Access Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white font-extrabold text-xs sm:text-sm px-6 shadow-sm">
                <Link to="/citizen">Citizen Portal</Link>
              </Button>

              <Button asChild size="lg" className="bg-[#1565C0] hover:bg-[#1565C0]/90 text-white font-extrabold text-xs sm:text-sm px-6 shadow-sm">
                <Link to="/login">Department Login</Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="border-[#0B3D91] text-[#0B3D91] hover:bg-[#0B3D91]/5 font-bold text-xs sm:text-sm px-6">
                <Link to="/login">Admin Login</Link>
              </Button>
            </div>

            {/* Verification Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E2E8F0] text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#138808]">
                <CheckCircle2 className="h-4 w-4 text-[#138808]" /> PM Gati Shakti Compliant
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#0B3D91]">
                <CheckCircle2 className="h-4 w-4 text-[#0B3D91]" /> OpenStreetMap GIS
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#FF9933]">
                <CheckCircle2 className="h-4 w-4 text-[#FF9933]" /> XGBoost ML Models
              </div>
            </div>
          </div>

          {/* Right Column Official Banner Image */}
          <div className="relative">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 shadow-md overflow-hidden">
              <img
                src={heroCity}
                width={1280}
                height={960}
                alt="Smart City Government Infrastructure Banner"
                className="rounded-lg w-full object-cover max-h-[420px]"
              />
              <div className="mt-3 p-3 rounded bg-[#0B3D91] text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#FF9933]" />
                  <span className="font-bold">Inter-Department Spatial Engine</span>
                </div>
                <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded font-bold">STATUS: OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GOVERNMENT ANNOUNCEMENTS SECTION */}
      <section className="bg-[#F8FAFC] py-6 border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0B3D91] text-white px-3 py-1.5 rounded font-black text-xs shrink-0">
              <Bell className="h-4 w-4" /> OFFICIAL NOTICES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className="p-3 rounded border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm text-xs space-y-1">
                  <span className="font-extrabold text-[10px] text-[#0B3D91] uppercase tracking-wider block">
                    {a.tag}
                  </span>
                  <p className="text-slate-700 font-medium line-clamp-2">{a.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. KEY STATISTICS */}
      <section className="py-14 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
            <Badge variant="outline" className="bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20 font-bold text-xs">
              System Impact
            </Badge>
            <h2 className="text-2xl font-black text-[#0B3D91]">Key Operational Statistics</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Live indicators monitored across municipal infrastructure deployments.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center shadow-sm hover:border-[#0B3D91] transition-all"
              >
                <div className="grid h-9 w-9 place-items-center rounded bg-[#FFFFFF] border border-[#E2E8F0] mx-auto text-[#0B3D91] mb-2">
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-black text-[#0B3D91]">{s.value}</p>
                <p className="mt-1 text-xs font-bold text-[#1565C0]">{s.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-500 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CITIZEN SERVICES */}
      <section id="citizen-services" className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="bg-[#FF9933]/15 text-[#FF9933] border-[#FF9933]/40 font-bold text-xs">
              Public Governance Services
            </Badge>
            <h2 className="text-2xl font-black text-[#0B3D91]">Citizen Services & Grievance Portal</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Access transparent municipal services, file infrastructure complaints, and monitor resolution progress.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CITIZEN_SERVICES.map((cs) => (
              <div
                key={cs.title}
                className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm hover:shadow-md hover:border-[#0B3D91] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="grid h-10 w-10 place-items-center rounded bg-[#0B3D91] text-white">
                    <cs.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0B3D91]">{cs.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{cs.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <Link to={cs.link} className="inline-flex items-center gap-1 text-xs font-bold text-[#1565C0] hover:text-[#0B3D91]">
                    Access Service <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DEPARTMENT SERVICES */}
      <section id="departments" className="py-16 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20 font-bold text-xs">
              Officer & Executive Workspace
            </Badge>
            <h2 className="text-2xl font-black text-[#0B3D91]">Inter-Departmental Services</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Operational tools for Road, Water, Electricity, Drainage, and Waste Management officers.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DEPT_SERVICES.map((ds) => (
              <div
                key={ds.title}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 shadow-sm hover:border-[#1565C0] transition-all space-y-2"
              >
                <div className="grid h-9 w-9 place-items-center rounded bg-[#1565C0] text-white">
                  <ds.icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold text-[#0B3D91]">{ds.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{ds.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. AI INTELLIGENCE SECTION */}
      <section id="ai-platform" className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="bg-[#138808]/15 text-[#138808] border-[#138808]/30 font-bold text-xs">
              Predictive Decision Support
            </Badge>
            <h2 className="text-2xl font-black text-[#0B3D91]">AI Intelligence Modules</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Machine learning models providing objective conflict detection and priority classification.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AI_MODULES.map((ai) => (
              <div
                key={ai.title}
                className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-sm hover:border-[#0B3D91] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="grid h-10 w-10 place-items-center rounded bg-[#0B3D91] text-white">
                    <ai.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0B3D91]">{ai.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{ai.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-[#1565C0] hover:text-[#0B3D91]">
                    Learn More <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PROJECT WORKFLOW (10-STEP PROCESS FLOW) */}
      <section id="workflow" className="py-16 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20 font-bold text-xs">
              Governance Process Lifecycle
            </Badge>
            <h2 className="text-2xl font-black text-[#0B3D91]">10-Step Infrastructure Decision Flow</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Standardized flow from citizen request registration to automated notification upon work completion.
            </p>
          </div>

          {/* Process Flow Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {WORKFLOW_STEPS.map((w) => (
              <div key={w.step} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center space-y-2 shadow-sm">
                <span className="inline-grid h-7 w-7 place-items-center rounded-full bg-[#0B3D91] text-white font-black text-xs">
                  {w.step}
                </span>
                <h3 className="text-xs font-extrabold text-[#0B3D91]">{w.title}</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">{w.dept}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SMART CITY HIGHLIGHTS */}
      <section id="about" className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="bg-[#138808]/15 text-[#138808] border-[#138808]/30 font-bold text-xs">
              Core Principles
            </Badge>
            <h2 className="text-2xl font-black text-[#0B3D91]">Smart City Governance Highlights</h2>
            <p className="text-slate-600 text-xs font-semibold">
              Key operational pillars driving transparent and efficient municipal administration.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-5 space-y-2 shadow-sm">
                <div className="grid h-8 w-8 place-items-center rounded bg-[#0B3D91] text-white">
                  <h.icon className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-extrabold text-[#0B3D91]">{h.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. LATEST PROJECTS TABLE */}
      <section className="py-16 bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge variant="outline" className="bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20 font-bold text-xs mb-1">
                Official Directory
              </Badge>
              <h2 className="text-2xl font-black text-[#0B3D91]">Recent Municipal Works Directory</h2>
            </div>
            <Button asChild size="sm" className="bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white font-bold text-xs">
              <Link to="/login">View Full Project Directory</Link>
            </Button>
          </div>

          {/* Project Table */}
          <div className="rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left text-[#0F172A]">
              <thead className="bg-[#0B3D91] text-white uppercase text-[10px] font-extrabold">
                <tr>
                  <th className="px-4 py-3">Project Ref ID</th>
                  <th className="px-4 py-3">Infrastructure Work Title</th>
                  <th className="px-4 py-3">Department Division</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-[#FFFFFF]">
                {RECENT_PROJECTS.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC] transition">
                    <td className="px-4 py-3 font-mono font-bold text-[#0B3D91]">{p.id}</td>
                    <td className="px-4 py-3 font-extrabold">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">{p.dept}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === "SANCTIONED" ? "bg-[#138808]/15 text-[#138808]" :
                        p.status === "IN_PROGRESS" ? "bg-[#1565C0]/15 text-[#1565C0]" :
                        "bg-[#FF9933]/15 text-[#FF9933]"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0B3D91]">{p.priority}</td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{p.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 12. CALL TO ACTION (CTA) */}
      <section className="bg-[#0B3D91] text-white py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-8 text-center space-y-6">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-bold text-xs">
            Government Digital Infrastructure
          </Badge>

          <h2 className="text-3xl font-black text-white sm:text-4xl">
            Building Smarter Cities Through Artificial Intelligence
          </h2>

          <p className="text-blue-100 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Transforming urban governance through predictive analytics, intelligent planning, and collaborative decision-making.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-extrabold text-xs sm:text-sm px-8 shadow-md">
              <Link to="/citizen">Access Citizen Portal</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="border-white text-white bg-transparent hover:bg-white/10 font-bold text-xs sm:text-sm px-8">
              <Link to="/login">Department Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 13. OFFICIAL GOVERNMENT FOOTER */}
      <footer id="contact" className="bg-[#072459] text-slate-300 py-12 border-t border-blue-900 text-xs">
        <div className="mx-auto max-w-7xl px-4 md:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Emblem & Title */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded bg-[#0B3D91] text-white font-black text-base border border-blue-400">
                  GOI
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white block">Government of India</span>
                  <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider block">Smart Cities Mission</span>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Intelligent Smart City Management System Using AI-Based Predictive Analytics and Inter-Departmental Data Interoperability.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#about" className="hover:text-white transition">About Mission</a></li>
                <li><a href="#departments" className="hover:text-white transition">Departments</a></li>
                <li><a href="#citizen-services" className="hover:text-white transition">Citizen Services</a></li>
                <li><Link to="/login" className="hover:text-white transition">Official Login</Link></li>
              </ul>
            </div>

            {/* Col 3: Policy & Terms */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Policies & Guidelines</h4>
              <ul className="space-y-1.5 text-slate-300 font-medium">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Hyperlinking Policy</li>
                <li>Copyright Policy</li>
                <li>Accessibility Statement</li>
              </ul>
            </div>

            {/* Col 4: Official Contact */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Command Center Contact</h4>
              <div className="space-y-1.5 text-slate-300 font-medium">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FF9933]" /> Smart City Command HQ, Sector 4
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#FF9933]" /> helpdesk@smartcity.gov.in
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#FF9933]" /> 1800-425-7000 (Toll-Free)
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t border-blue-950 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© 2026 Government of India · Smart Cities Mission. All Rights Reserved.</p>
            <p className="text-slate-300 font-semibold">
              Developed for Smart City Digital Governance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
