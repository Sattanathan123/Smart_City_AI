import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Layers, Navigation, ShieldAlert, CheckCircle2 } from "lucide-react";
import { fetchProjects, ProjectData } from "@/lib/api";

export const Route = createFileRoute("/gis-map")({
  head: () => ({
    meta: [
      { title: "GIS Project Map — URBAN PULSE AI" },
      { name: "description", content: "Interactive OpenStreetMap spatial visualization for city projects." },
    ],
  }),
  component: GisMapPage,
});

declare global {
  interface Window {
    L: any;
  }
}

const ZONE_COORDS: Record<string, [number, number]> = {
  "Zone 1": [13.0827, 80.2707],
  "Zone 2": [13.0604, 80.2496],
  "Zone 3": [13.0418, 80.2341],
  "Zone 4": [13.0878, 80.2184],
  "Zone 5": [13.1187, 80.2304],
  "Zone 6": [13.0012, 80.2565],
  "Zone 7": [12.9815, 80.2180],
};

export default function GisMapPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedConflict, setSelectedConflict] = useState<string>("ALL");
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!window.L && !document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else if (window.L) {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!mapRef.current || leafletInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current).setView([13.0827, 80.2707], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    leafletInstanceRef.current = map;
  };

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        setProjects(data);
        if (data.length > 0) setActiveProject(data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (selectedDepartment !== "ALL" && p.department !== selectedDepartment) return false;
    if (selectedStatus !== "ALL" && p.status !== selectedStatus) return false;
    if (selectedConflict === "CONFLICT" && p.prediction?.conflictPrediction !== "Conflict") return false;
    if (selectedConflict === "NO_CONFLICT" && p.prediction?.conflictPrediction === "Conflict") return false;
    return true;
  });

  useEffect(() => {
    const L = window.L;
    if (!L || !markersLayerRef.current || !leafletInstanceRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredProjects.forEach((p, idx) => {
      const baseCoords = ZONE_COORDS[p.zone] || [13.0827 + idx * 0.01, 80.2707 + idx * 0.01];
      const lat = baseCoords[0] + (Math.random() - 0.5) * 0.015;
      const lng = baseCoords[1] + (Math.random() - 0.5) * 0.015;

      const isConflict = p.prediction?.conflictPrediction === "Conflict";
      const color = isConflict
        ? "#ef4444"
        : p.status === "COMPLETED"
        ? "#10b981"
        : p.status === "ACTIVE" || p.status === "IN_PROGRESS"
        ? "#f59e0b"
        : "#3b82f6";

      const marker = L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: color,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px;">
          <b style="color: #0f172a; font-size: 13px;">${p.projectName}</b><br/>
          <span style="font-size: 11px; color: #64748b;">${p.department} Dept · ${p.zone}</span><br/>
          <div style="margin-top: 4px; font-size: 11px;">
            <b>Budget:</b> ₹${p.budgetLakhs}L<br/>
            <b>Status:</b> ${p.status}<br/>
            <b style="color: ${isConflict ? '#ef4444' : '#10b981'}">
              ${isConflict ? '⚠️ AI CONFLICT DETECTED' : '✅ NO CONFLICT'}
            </b>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => setActiveProject(p));
      markersLayerRef.current.addLayer(marker);
    });
  }, [filteredProjects]);

  const departments = ["ALL", "Road", "Water", "Electricity", "Drainage", "Waste Management"];
  const statuses = ["ALL", "ACTIVE", "COMPLETED", "PENDING_APPROVAL", "DRAFT"];

  const handleRecenter = () => {
    if (leafletInstanceRef.current) {
      leafletInstanceRef.current.setView([13.0827, 80.2707], 12);
    }
  };

  return (
    <DashboardShell title="GIS Project Interactive Map" subtitle="Module 4 — Real OpenStreetMap Spatial Intelligence">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 font-bold">
                100% Real OpenStreetMap + Leaflet GIS
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
              GIS Project Interactive Visualization
            </h1>
            <p className="text-muted-foreground text-sm">
              Live geospatial mapping powered by OpenStreetMap & Leaflet JS tile engine.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRecenter}>
              <Navigation className="h-4 w-4" /> Recenter Map
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border shadow-sm bg-card/60 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Filter className="h-4 w-4 text-primary" /> Filter GIS Map:
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Department:</span>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="h-8 text-xs rounded-md border border-input bg-background px-2 py-1 text-foreground"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8 text-xs rounded-md border border-input bg-background px-2 py-1 text-foreground"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conflict Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">AI Conflict:</span>
                <select
                  value={selectedConflict}
                  onChange={(e) => setSelectedConflict(e.target.value)}
                  className="h-8 text-xs rounded-md border border-input bg-background px-2 py-1 text-foreground"
                >
                  <option value="ALL">All Risk Levels</option>
                  <option value="CONFLICT">High Risk / Conflict Only</option>
                  <option value="NO_CONFLICT">Clean Corridor Only</option>
                </select>
              </div>

              {/* Map Legend */}
              <div className="ml-auto flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-amber-500"></span> Ongoing
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span> Planned
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span> AI Conflict Risk
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Canvas & Detail Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* REAL OpenStreetMap Leaflet Map Div */}
          <div className="lg:col-span-2 relative min-h-[520px] rounded-xl border shadow-inner overflow-hidden z-0 bg-slate-900">
            <div ref={mapRef} className="absolute inset-0 h-full w-full z-0"></div>
          </div>

          {/* Project GIS Detail Inspector */}
          <div className="space-y-4">
            {activeProject ? (
              <Card className="border shadow-md">
                <CardHeader className="pb-3 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {activeProject.zone}
                    </Badge>
                    <Badge
                      className={
                        activeProject.prediction?.conflictPrediction === "Conflict"
                          ? "bg-red-500/10 text-red-600 border-red-200"
                          : "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                      }
                    >
                      {activeProject.prediction?.conflictPrediction === "Conflict" ? "AI Conflict Detected" : "No Conflict"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2 text-foreground">{activeProject.projectName}</CardTitle>
                  <CardDescription className="text-xs">{activeProject.department} Department</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-muted/50 border">
                      <span className="text-muted-foreground block text-[10px]">Budget Allocated</span>
                      <span className="font-bold text-sm text-foreground">₹{activeProject.budgetLakhs} Lakhs</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/50 border">
                      <span className="text-muted-foreground block text-[10px]">Duration</span>
                      <span className="font-bold text-sm text-foreground">{activeProject.durationDays} Days</span>
                    </div>
                  </div>

                  {/* AI Prediction Details */}
                  <div className="p-3 rounded-lg border bg-card space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Conflict Probability:</span>
                      <span className="font-bold text-red-500">
                        {activeProject.prediction?.conflictProbability
                          ? (activeProject.prediction.conflictProbability * 100).toFixed(1)
                          : "0.0"}
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Priority Classification:</span>
                      <Badge variant="secondary">{activeProject.prediction?.priorityPrediction || "Medium"}</Badge>
                    </div>
                  </div>

                  {/* GIS Metadata */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b">
                      <span className="text-muted-foreground">Traffic Density Index:</span>
                      <span className="font-medium">{activeProject.trafficDensity || 5} / 10</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b">
                      <span className="text-muted-foreground">Utility Dependency:</span>
                      <span className="font-medium">{activeProject.utilityDependency || 5} / 10</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline">{activeProject.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-6 text-center text-muted-foreground text-sm">
                Click any marker on the OpenStreetMap GIS canvas to view detailed attributes.
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
