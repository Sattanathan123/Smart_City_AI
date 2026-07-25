import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Filter, ZoomIn, ZoomOut } from "lucide-react";

export const Route = createFileRoute("/conflict-heatmap")({
  head: () => ({
    meta: [
      { title: "Spatial Conflict Heat Map — URBAN PULSE AI" },
      { name: "description", content: "Interactive OpenStreetMap spatial overlap risk heatmap." },
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
  { zone: "Zone 5", lat: 13.1187, lng: 80.2304, intensity: "CRITICAL", score: 94, conflicts: 3, dept: "Road / Water Overlap", radius: 800, color: "#ef4444" },
  { zone: "Zone 1", lat: 13.0827, lng: 80.2707, intensity: "HIGH", score: 78, conflicts: 2, dept: "Flyover / Electricity", radius: 650, color: "#f97316" },
  { zone: "Zone 3", lat: 13.0418, lng: 80.2341, intensity: "MEDIUM", score: 55, conflicts: 1, dept: "Drainage / Utilities", radius: 500, color: "#f59e0b" },
  { zone: "Zone 2", lat: 13.0604, lng: 80.2496, intensity: "LOW", score: 20, conflicts: 0, dept: "Solar Grid", radius: 350, color: "#10b981" },
  { zone: "Zone 4", lat: 13.0878, lng: 80.2184, intensity: "LOW", score: 15, conflicts: 0, dept: "Waste Mgmt", radius: 300, color: "#10b981" },
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
        <div style="font-family: sans-serif; padding: 4px;">
          <b style="font-size: 13px; color: ${h.color};">${h.zone} Hotspot — ${h.intensity} RISK</b><br/>
          <span style="font-size: 11px; color: #475569;">${h.dept}</span><br/>
          <div style="margin-top: 4px; font-size: 11px;">
            <b>Spatial Overlap Risk Score:</b> ${h.score}/100<br/>
            <b>Detected Conflicts:</b> ${h.conflicts} Projects
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
    <DashboardShell title="Urban Conflict Heat Map" subtitle="Module 5 — Real OpenStreetMap Spatial Risk Heatmap">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200 font-bold">
                100% Real Leaflet OpenStreetMap Spatial Heatmap
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground flex items-center gap-2">
              Urban Conflict Heat Map <Flame className="h-6 w-6 text-red-500 animate-bounce" />
            </h1>
            <p className="text-muted-foreground text-sm">
              Live spatial overlap risk density gradient rendered over OpenStreetMap tiles.
            </p>
          </div>

          {/* Zoom & Controls */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleZoom(1)} className="gap-1">
              <ZoomIn className="h-4 w-4" /> Zoom In
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleZoom(-1)} className="gap-1">
              <ZoomOut className="h-4 w-4" /> Zoom Out
            </Button>
          </div>
        </div>

        {/* Heatmap Controls Bar */}
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">Filter Heatmap by Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-8 text-xs rounded-md border bg-background px-2 text-foreground"
              >
                <option value="ALL">All Departments</option>
                <option value="Road">Road Department</option>
                <option value="Water">Water Department</option>
                <option value="Electricity">Electricity Department</option>
                <option value="Drainage">Drainage Department</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-600 animate-pulse"></span> Critical Risk (&gt;80%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-orange-500"></span> High Risk (70-80%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500"></span> Moderate (50-70%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Low Risk (&lt;50%)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* REAL OpenStreetMap Leaflet Heatmap Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative min-h-[520px] rounded-xl border shadow-inner overflow-hidden z-0 bg-slate-900">
            <div ref={mapRef} className="absolute inset-0 h-full w-full z-0"></div>
          </div>

          {/* Selected Zone Inspector & Mitigation */}
          <div className="space-y-4">
            {selectedZone ? (
              <Card className="border shadow-md">
                <CardHeader className="pb-3 border-b bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
                      {selectedZone.zone}
                    </Badge>
                    <Badge className={selectedZone.score > 75 ? "bg-red-500 text-white" : "bg-amber-500 text-white"}>
                      {selectedZone.intensity} RISK
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2 text-foreground flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-500" /> {selectedZone.dept} Hotspot
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Spatial Overlap Risk Score: <span className="font-bold text-foreground">{selectedZone.score} / 100</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="p-3 rounded-lg border bg-card space-y-1">
                    <span className="font-bold text-foreground block">AI Mitigation Strategy</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Shift utility main trenching schedule by 7-10 days to avoid arterial road closure in {selectedZone.zone}.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card space-y-1">
                    <span className="font-bold text-foreground block">Traffic & Corridor Rerouting</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Reroute heavy commercial transport via sector bypass road during night shift (10 PM - 5 AM).
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="p-6 text-center text-muted-foreground text-sm">
                Click any heatmap zone circle on OpenStreetMap to inspect risk attributes.
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
