import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Navigation } from "lucide-react";
import { fetchProjects, ProjectData } from "@/lib/api";

export const Route = createFileRoute("/gis-map")({
  head: () => ({
    meta: [
      { title: "GIS Spatial Map — URBAN PULSE Platform" },
      { name: "description", content: "Interactive Municipal GIS Spatial Map visualization for city projects." },
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
        ? "#DC2626"
        : p.status === "COMPLETED"
        ? "#16A34A"
        : p.status === "ACTIVE" || p.status === "IN_PROGRESS"
        ? "#F59E0B"
        : "#3B82F6";

      const marker = L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: color,
        color: "#FFFFFF",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; color: #0F172A;">
          <b style="color: #0F172A; font-size: 13px;">${p.projectName}</b><br/>
          <span style="font-size: 11px; color: #475569;">${p.department} Dept · ${p.zone}</span><br/>
          <div style="margin-top: 4px; font-size: 11px; color: #0F172A;">
            <b>Budget:</b> ₹${p.budgetLakhs}L<br/>
            <b>Status:</b> ${p.status}<br/>
            <b style="color: ${isConflict ? '#DC2626' : '#16A34A'}">
              ${isConflict ? '⚠️ CONFLICT RISK' : '✅ CLEAN CORRIDOR'}
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
    <DashboardShell title="GIS Project Interactive Map" subtitle="Municipal Spatial Infrastructure Coordinates">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-3">
          <div>
            <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/30 font-bold text-[10px]">
              Geospatial Infrastructure Intelligence
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1">Geospatial Infrastructure Map</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleRecenter} className="gap-2 text-xs border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]">
            <Navigation className="h-4 w-4" /> Recenter Map
          </Button>
        </div>

        {/* Filters */}
        <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
          <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                <Filter className="h-4 w-4 text-[#1E3A8A]" /> GIS Filters:
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Department:</span>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 text-[#0F172A] font-semibold"
                >
                  {departments.map((d) => (
                    <option key={d} value={d} className="bg-white text-[#0F172A]">{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 text-[#0F172A] font-semibold"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s} className="bg-white text-[#0F172A]">{s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Map Legend */}
            <div className="flex items-center gap-3 font-bold text-[11px] text-[#0F172A]">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#16A34A]"></span> Completed</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#F59E0B]"></span> Ongoing</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#3B82F6]"></span> Planned</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#DC2626] animate-pulse"></span> Conflict Risk</span>
            </div>
          </CardContent>
        </Card>

        {/* Map Canvas & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative min-h-[500px] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden z-0 bg-slate-900">
            <div ref={mapRef} className="absolute inset-0 h-full w-full z-0"></div>
          </div>

          <div className="space-y-4">
            {activeProject ? (
              <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
                <CardHeader className="pb-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20 font-bold">
                      {activeProject.zone}
                    </Badge>
                    <Badge
                      className={
                        activeProject.prediction?.conflictPrediction === "Conflict"
                          ? "bg-[#DC2626] text-white font-bold"
                          : "bg-[#16A34A] text-white font-bold"
                      }
                    >
                      {activeProject.prediction?.conflictPrediction === "Conflict" ? "Conflict Risk" : "Clean Corridor"}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-[#0F172A] mt-2">{activeProject.projectName}</CardTitle>
                  <CardDescription className="text-xs text-slate-600 font-medium">{activeProject.department} Department</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs bg-[#FFFFFF]">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                      <span className="text-[10px] text-slate-500 font-bold block">BUDGET ALLOCATED</span>
                      <span className="font-black text-sm text-[#0F172A]">₹{activeProject.budgetLakhs}L</span>
                    </div>
                    <div className="p-2.5 rounded border border-[#E2E8F0] bg-[#F8FAFC]">
                      <span className="text-[10px] text-slate-500 font-bold block">DURATION</span>
                      <span className="font-black text-sm text-[#0F172A]">{activeProject.durationDays} Days</span>
                    </div>
                  </div>

                  <div className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-bold">Conflict Probability:</span>
                      <span className="font-black text-[#DC2626]">
                        {activeProject.prediction?.conflictProbability
                          ? (activeProject.prediction.conflictProbability * 100).toFixed(1)
                          : "0.0"}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-6 text-center text-slate-500 text-xs font-medium border-[#E2E8F0] bg-[#FFFFFF]">
                Click any GIS marker on the map to inspect project attributes.
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
