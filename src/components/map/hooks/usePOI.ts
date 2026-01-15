import { useState, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import type { POI, POICategory } from "../types";
import { poiCategories } from "../constants";

interface UsePOIProps {
  map: maplibregl.Map | null;
}

export const usePOI = ({ map }: UsePOIProps) => {
  const [pois, setPois] = useState<POI[]>([]);
  const [activePOICategories, setActivePOICategories] = useState<Set<POICategory>>(new Set());
  const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
  const poiMarkersRef = useRef<maplibregl.Marker[]>([]);

  const fetchPOIs = useCallback(async (category: POICategory) => {
    if (!map) return [];

    const bounds = map.getBounds();
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    
    const query = `
      [out:json][timeout:25];
      (
        node[${poiCategories[category].query}](${bbox});
        way[${poiCategories[category].query}](${bbox});
      );
      out center 50;
    `;

    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const data = await response.json();
      
      return data.elements.map((element: any) => ({
        id: element.id,
        type: category,
        name: element.tags?.name || `Unnamed ${poiCategories[category].name.slice(0, -1)}`,
        lat: element.lat || element.center?.lat,
        lon: element.lon || element.center?.lon,
      })).filter((poi: POI) => poi.lat && poi.lon);
    } catch (error) {
      console.error(`Error fetching ${category} POIs:`, error);
      return [];
    }
  }, [map]);

  const togglePOICategory = useCallback(async (category: POICategory) => {
    const newCategories = new Set(activePOICategories);
    
    if (newCategories.has(category)) {
      newCategories.delete(category);
      setActivePOICategories(newCategories);
      const remainingPois = pois.filter(poi => poi.type !== category);
      setPois(remainingPois);
    } else {
      newCategories.add(category);
      setActivePOICategories(newCategories);
      
      setIsLoadingPOIs(true);
      const newPOIs = await fetchPOIs(category);
      setPois(prev => [...prev, ...newPOIs]);
      setIsLoadingPOIs(false);
    }
  }, [activePOICategories, pois, fetchPOIs]);

  const clearAllPOIs = useCallback(() => {
    setActivePOICategories(new Set());
    setPois([]);
    poiMarkersRef.current.forEach(marker => marker.remove());
    poiMarkersRef.current = [];
  }, []);

  // Update POI markers
  const updatePOIMarkers = useCallback(() => {
    if (!map) return;

    poiMarkersRef.current.forEach(marker => marker.remove());
    poiMarkersRef.current = [];

    pois.forEach(poi => {
      const category = poiCategories[poi.type];
      const el = document.createElement("div");
      el.innerHTML = `
        <div class="relative group cursor-pointer">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white" style="background-color: ${category.color}">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              ${getPOIIconSVG(poi.type)}
            </svg>
          </div>
          <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            <div class="bg-gray-900/90 text-white text-xs px-2 py-1 rounded shadow-lg max-w-[200px] truncate">
              ${poi.name}
            </div>
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([poi.lon, poi.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <div class="font-semibold text-sm">${poi.name}</div>
              <div class="text-xs text-gray-500 mt-1 capitalize">${poi.type}</div>
            </div>
          `)
        )
        .addTo(map);

      poiMarkersRef.current.push(marker);
    });
  }, [map, pois]);

  const getPOIIconSVG = (type: POICategory): string => {
    switch (type) {
      case "hospital":
        return '<path d="M8 21h8m-4-9v9m-6-3h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"/><path d="M9 7h6m-3-3v6"/>';
      case "school":
        return '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>';
      case "fuel":
        return '<path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16m0-16l4 4v10a2 2 0 01-2 2M7 8h4m-2 0v4"/>';
      case "restaurant":
        return '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20m14-18v4a4 4 0 01-4 4h-1v10"/>';
      default:
        return '<circle cx="12" cy="12" r="3"/>';
    }
  };

  return {
    pois,
    activePOICategories,
    isLoadingPOIs,
    togglePOICategory,
    clearAllPOIs,
    updatePOIMarkers,
  };
};
