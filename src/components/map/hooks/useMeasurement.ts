import { useState, useRef, useCallback, useEffect } from "react";
import maplibregl from "maplibre-gl";
import type { MeasureMode } from "../types";
import { calculateLineDistance, calculatePolygonArea } from "../utils";

interface UseMeasurementProps {
  map: maplibregl.Map | null;
}

export const useMeasurement = ({ map }: UseMeasurementProps) => {
  const [measureMode, setMeasureMode] = useState<MeasureMode>("none");
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [measureResult, setMeasureResult] = useState<{ distance?: number; area?: number } | null>(null);
  const measureMarkersRef = useRef<maplibregl.Marker[]>([]);

  const toggleMeasureMode = useCallback((mode: "distance" | "area") => {
    if (measureMode === mode) {
      setMeasureMode("none");
      clearMeasurement();
    } else {
      setMeasureMode(mode);
      clearMeasurement();
    }
  }, [measureMode]);

  const clearMeasurement = useCallback(() => {
    setMeasurePoints([]);
    setMeasureResult(null);
    
    measureMarkersRef.current.forEach(marker => marker.remove());
    measureMarkersRef.current = [];
    
    if (map) {
      if (map.getLayer("measure-line")) {
        map.removeLayer("measure-line");
      }
      if (map.getLayer("measure-fill")) {
        map.removeLayer("measure-fill");
      }
      if (map.getSource("measure-geojson")) {
        map.removeSource("measure-geojson");
      }
    }
  }, [map]);

  const updateMeasurementVisualization = useCallback((points: [number, number][]) => {
    if (!map || points.length === 0) return;

    const geojsonData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: []
    };

    if (measureMode === "distance" && points.length >= 2) {
      geojsonData.features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: points
        }
      });
    } else if (measureMode === "area" && points.length >= 3) {
      geojsonData.features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [[...points, points[0]]]
        }
      });
    }

    if (!map.getSource("measure-geojson")) {
      map.addSource("measure-geojson", {
        type: "geojson",
        data: geojsonData
      });

      map.addLayer({
        id: "measure-fill",
        type: "fill",
        source: "measure-geojson",
        paint: {
          "fill-color": "#8b5cf6",
          "fill-opacity": 0.2
        }
      });

      map.addLayer({
        id: "measure-line",
        type: "line",
        source: "measure-geojson",
        paint: {
          "line-color": "#8b5cf6",
          "line-width": 3,
          "line-dasharray": [2, 1]
        }
      });
    } else {
      (map.getSource("measure-geojson") as maplibregl.GeoJSONSource).setData(geojsonData);
    }
  }, [map, measureMode]);

  // Handle map click for measurement
  useEffect(() => {
    if (!map || measureMode === "none") return;

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      const point: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      
      setMeasurePoints(prev => {
        const newPoints = [...prev, point];
        
        // Add marker
        const el = document.createElement("div");
        el.innerHTML = `
          <div class="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span class="text-[8px] text-white font-bold">${newPoints.length}</span>
          </div>
        `;
        
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(point)
          .addTo(map);
        
        measureMarkersRef.current.push(marker);
        
        // Calculate result
        if (measureMode === "distance" && newPoints.length >= 2) {
          setMeasureResult({ distance: calculateLineDistance(newPoints) });
        } else if (measureMode === "area" && newPoints.length >= 3) {
          setMeasureResult({ area: calculatePolygonArea(newPoints) });
        }
        
        updateMeasurementVisualization(newPoints);
        
        return newPoints;
      });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, measureMode, updateMeasurementVisualization]);

  return {
    measureMode,
    measurePoints,
    measureResult,
    toggleMeasureMode,
    clearMeasurement,
  };
};
