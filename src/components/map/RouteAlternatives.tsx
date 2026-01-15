import { motion } from "framer-motion";
import { Clock, Ruler, TrendingUp, Leaf, Zap, Check } from "lucide-react";
import type { RouteInfo } from "./types";
import { formatDistance, formatDuration } from "./utils";

interface RouteAlternative extends RouteInfo {
  type: "fastest" | "shortest" | "balanced";
  savings?: {
    time?: number;
    distance?: number;
  };
}

interface RouteAlternativesProps {
  routes: RouteAlternative[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const RouteAlternatives = ({ routes, selectedIndex, onSelect }: RouteAlternativesProps) => {
  const getRouteIcon = (type: string) => {
    switch (type) {
      case "fastest":
        return Zap;
      case "shortest":
        return TrendingUp;
      case "balanced":
        return Leaf;
      default:
        return Clock;
    }
  };

  const getRouteLabel = (type: string) => {
    switch (type) {
      case "fastest":
        return "Fastest";
      case "shortest":
        return "Shortest";
      case "balanced":
        return "Balanced";
      default:
        return "Route";
    }
  };

  const getRouteColor = (type: string) => {
    switch (type) {
      case "fastest":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "shortest":
        return "text-green-600 bg-green-50 border-green-200";
      case "balanced":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-2 p-3">
      {routes.length > 1 && (
        <div className="text-xs font-medium text-gray-500 mb-2">
          {routes.length} route{routes.length !== 1 ? 's' : ''} available
        </div>
      )}
      
      {routes.map((route, index) => {
        const Icon = getRouteIcon(route.type);
        const isSelected = index === selectedIndex;
        const colorClass = getRouteColor(route.type);
        
        return (
          <motion.button
            key={index}
            onClick={() => onSelect(index)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? `${colorClass} shadow-md scale-[1.02]`
                : "bg-white border-gray-200 hover:border-gray-300 hover:shadow"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/50' : 'bg-gray-100'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {getRouteLabel(route.type)}
                  </div>
                  {route.savings && (
                    <div className="text-xs text-gray-500">
                      {route.savings.time && `Save ${Math.round(route.savings.time / 60)} min`}
                      {route.savings.distance && ` • ${(route.savings.distance / 1000).toFixed(1)} km shorter`}
                    </div>
                  )}
                </div>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-green-600" />
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{formatDuration(route.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                <span className="font-medium">{formatDistance(route.distance)}</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default RouteAlternatives;
