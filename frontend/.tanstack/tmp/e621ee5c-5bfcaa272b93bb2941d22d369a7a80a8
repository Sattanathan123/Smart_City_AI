// redirect route for legacy GIS map URL
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/officer/gis-map")({
  component: LegacyGisRedirect,
});

function LegacyGisRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    // navigate to the proper GIS map route
    navigate({ to: "/gis-map" });
  }, [navigate]);
  return null;
}
