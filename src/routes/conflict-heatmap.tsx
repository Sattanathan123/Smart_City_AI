import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Filter, ZoomIn, ZoomOut } from "lucide-react";

export const Route = createFileRoute("/conflict-heatmap")({
  head: () => ({
    meta: [
      { title: "Spatial Conflict Heat Map — URBAN PULSE Platform" },
      { name: "description", content: "Interactive OpenStreetMap spatial overlap risk density heatmap." },
    ],
  }),
  component: ConflictHeatmapPage,
});

declare global {
  interface Window {
    L: any;
  }
}

const HEAT_ZONES_COORDS = [
  { zone: "Zone 5", lat: 13.1187, lng: 80.2304, intensity: "CRITICAL", score: 94, conflicts: 3, dept: "Road / Water Overlap", radius: 800, color: "#DC2626" },
  { zone: "Zone 1", lat: 13.0827, lng: 80.2707, intensity: "HIGH", score: 78, conflicts: 2, dept: "Flyover / Electricity", radius: 650, color: "#F59E0B" },
  { zone: "Zone 3", lat: 13.0418, lng: 80.2341, intensity: "MEDIUM", score: 55, conflicts: 1, dept: "Drainage / Utilities", radius: 500, color: "#3B82F6" },
  { zone: "Zone 2", lat: 13.0604, lng: 80.2496, intensity: "LOW", score: 20, conflicts: 0, dept: "Solar Grid", radius: 350, color: "#16A34A" },
  { zone: "Zone 4", lat: 13.0878, lng: 80.2184, intensity: "LOW", score: 15, conflicts: 0, dept: "Waste Mgmt", radius: 300, color: "#16A34A" },
];

export default function ConflictHeatmapPage() {
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [selectedZone, setSelectedZone] = useState<typeof HEAT_ZONES_COORDS[0] | null>(HEAT_ZONES_COORDS[0]);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const heatCirclesLayerRef = useRef<any>(null);

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
      script.onload = () => initHeatmap();
      document.body.appendChild(script);
    } else if (window.L) {
      initHeatmap();
    }
  }, []);

  const initHeatmap = () => {
    if (!mapRef.current || leafletInstanceRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current).setView([13.0827, 80.2707], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    heatCirclesLayerRef.current = L.layerGroup().addTo(map);
    leafletInstanceRef.current = map;
    renderHeatCircles();
  };

  const renderHeatCircles = () => {
    const L = window.L;
    if (!L || !heatCirclesLayerRef.current) return;

    heatCirclesLayerRef.current.clearLayers();

    HEAT_ZONES_COORDS.forEach((h) => {
      if (departmentFilter !== "ALL" && !h.dept.toLowerCase().includes(departmentFilter.toLowerCase())) {
        return;
      }

      const glowCircle = L.circle([h.lat, h.lng], {
        radius: h.radius * 1.5,
        fillColor: h.color,
        fillOpacity: 0.25,
        color: "transparent",
      });

      const coreCircle = L.circle([h.lat, h.lng], {
        radius: h.radius,
        fillColor: h.color,
        fillOpacity: 0.6,
        color: h.color,
        weight: 2,
      });

      coreCircle.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #0F172A;">
          <b style="font-size: 13px; color: ${h.color};">${h.zone} Hotspot — ${h.intensity} RISK</b><br/>
          <span style="font-size: 11px; color: #475569;">${h.dept}</span><br/>
          <div style="margin-top: 4px; font-size: 11px; color: #0F172A;">
            <b>Risk Score:</b> ${h.score}/100<br/>
            <b>Conflicts:</b> ${h.conflicts} Projects
          </div>
        </div>
      `);

      coreCircle.on("click", () => setSelectedZone(h));
      heatCirclesLayerRef.current.addLayer(glowCircle);
      heatCirclesLayerRef.current.addLayer(coreCircle);
    });
  };

  useEffect(() => {
    renderHeatCircles();
  }, [departmentFilter]);

  const handleZoom = (delta: number) => {
    if (leafletInstanceRef.current) {
      const currentZoom = leafletInstanceRef.current.getZoom();
      leafletInstanceRef.current.setZoom(currentZoom + delta);
    }
  };

  return (
    <DashboardShell title="Spatial Conflict Heat Map" subtitle="Module 5 — OpenStreetMap Overlap Density Hotspot Engine">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E8F0] pb-3">
          <div>
            <Badge variant="outline" className="bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/30 font-bold text-[10px]">
              Module 5 — Spatial Density Heatmap
            </Badge>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A] mt-1 flex items-center gap-2">
              Urban Conflict Heat Map <Flame className="h-5 w-5 text-[#DC2626]" />
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleZoom(1)} className="gap-1 text-xs border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]">
              <ZoomIn className="h-4 w-4" /> Zoom In
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleZoom(-1)} className="gap-1 text-xs border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9]">
              <ZoomOut className="h-4 w-4" /> Zoom Out
            </Button>
          </div>
        </div>

        {/* Heatmap Controls Bar */}
        <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
          <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#1E3A8A]" />
              <span className="font-bold text-[#0F172A]">Department Filter:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-8 text-xs rounded border border-[#E2E8F0] bg-white px-2 text-[#0F172A] font-semibold"
              >
                <option value="ALL" className="bg-white text-[#0F172A]">All Departments</option>
                <option value="Road" className="bg-white text-[#0F172A]">Road Department</option>
                <option value="Water" className="bg-white text-[#0F172A]">Water Department</option>
                <option value="Electricity" className="bg-white text-[#0F172A]">Electricity Department</option>
                <option value="Drainage" className="bg-white text-[#0F172A]">Drainage Department</option>
              </select>
            </div>

            <div className="flex items-center gap-3 font-bold text-[11px] text-[#0F172A]">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#DC2626] animate-pulse"></span> Critical (&gt;80%)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#F59E0B]"></span> High (70-80%)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#3B82F6]"></span> Moderate (50-70%)</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-[#16A34A]"></span> Low (&lt;50%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Map & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative min-h-[500px] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden z-0 bg-slate-900">
            <div ref={mapRef} className="absolute inset-0 h-full w-full z-0"></div>
          </div>

          <div className="space-y-4">
            {selectedZone ? (
              <Card className="border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
                <CardHeader className="pb-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20 font-bold">
                      {selectedZone.zone}
                    </Badge>
                    <Badge className={selectedZone.score > 75 ? "bg-[#DC2626] text-white font-bold" : "bg-[#F59E0B] text-white font-bold"}>
                      {selectedZone.intensity} RISK
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-[#0F172A] mt-2 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-[#DC2626]" /> {selectedZone.dept} Hotspot
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs bg-[#FFFFFF]">
                  <div className="p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                    <span className="font-bold text-[#0F172A] block">Mitigation Strategy</span>
                    <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                      Shift utility main trenching schedule by 7-10 days to avoid arterial road closure in {selectedZone.zone}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-6 text-center text-slate-500 text-xs font-medium border-[#E2E8F0] bg-[#FFFFFF]">
                Click any heatmap zone circle to inspect risk parameters.
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
