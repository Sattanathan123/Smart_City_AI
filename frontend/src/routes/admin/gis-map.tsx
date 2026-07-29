// redirect route for legacy admin GIS map URL
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/gis-map")({
  component: AdminGisRedirect,
});

function AdminGisRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    // navigate to the proper GIS map route
    navigate({ to: "/gis-map" });
  }, [navigate]);
  return null;
}
