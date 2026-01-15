import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Share2, Trash2, MapPin, Clock, Ruler, Copy, Check, QrCode } from "lucide-react";
import { formatDistance, formatDuration } from "./utils";
import type { RouteInfo, RoutePoint } from "./types";

interface SavedRoute {
  id: string;
  name: string;
  start: RoutePoint;
  end: RoutePoint;
  distance: number;
  duration: number;
  createdAt: Date;
  isFavorite?: boolean;
}

interface SavedRoutesProps {
  onLoadRoute: (route: SavedRoute) => void;
}

const SavedRoutes = ({ onLoadRoute }: SavedRoutesProps) => {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const saveRoute = (route: Omit<SavedRoute, 'id' | 'createdAt'>) => {
    const newRoute: SavedRoute = {
      ...route,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    setRoutes(prev => [newRoute, ...prev]);
    
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
    localStorage.setItem('savedRoutes', JSON.stringify([newRoute, ...saved]));
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
    
    const saved = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
    localStorage.setItem('savedRoutes', JSON.stringify(saved.filter((r: SavedRoute) => r.id !== id)));
  };

  const shareRoute = async (route: SavedRoute) => {
    const shareUrl = `${window.location.origin}/route/${route.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: route.name,
          text: `Check out this route: ${formatDistance(route.distance)} • ${formatDuration(route.duration)}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(route.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {routes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No saved routes yet</p>
          <p className="text-xs mt-1">Save your favorite routes for quick access</p>
        </div>
      ) : (
        <AnimatePresence>
          {routes.map((route) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900">{route.name}</h4>
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{route.start.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{route.end.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  <span>{formatDistance(route.distance)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDuration(route.duration)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLoadRoute(route)}
                  className="flex-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors"
                >
                  Load Route
                </button>
                <button
                  onClick={() => shareRoute(route)}
                  className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  title="Share"
                >
                  {copiedId === route.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => deleteRoute(route.id)}
                  className="p-1.5 bg-gray-100 hover:bg-red-100 rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default SavedRoutes;
