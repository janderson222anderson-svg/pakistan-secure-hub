import { Route, LocateFixed, RadioTower, Navigation, Compass, Target, Activity, MapPin, Ruler, Square, Layers, Loader2 } from "lucide-react";

interface NavigationControlsProps {
  isRoutingMode: boolean;
  isTracking: boolean;
  isFollowMode: boolean;
  isLocating: boolean;
  showTrafficLayer: boolean;
  trafficLoading: boolean;
  showPOIPanel: boolean;
  isLoadingPOIs: boolean;
  measureMode: "none" | "distance" | "area";
  showLayerPanel: boolean;
  onToggleRouting: () => void;
  onToggleTracking: () => void;
  onToggleFollowMode: () => void;
  onLocateUser: () => void;
  onResetView: () => void;
  onToggleTraffic: () => void;
  onTogglePOI: () => void;
  onToggleMeasure: (mode: "distance" | "area") => void;
  onToggleLayerPanel: () => void;
}

const NavigationControls = ({
  isRoutingMode,
  isTracking,
  isFollowMode,
  isLocating,
  showTrafficLayer,
  trafficLoading,
  showPOIPanel,
  isLoadingPOIs,
  measureMode,
  showLayerPanel,
  onToggleRouting,
  onToggleTracking,
  onToggleFollowMode,
  onLocateUser,
  onResetView,
  onToggleTraffic,
  onTogglePOI,
  onToggleMeasure,
  onToggleLayerPanel,
}: NavigationControlsProps) => {
  return (
    <div className="absolute left-4 bottom-20 flex flex-col gap-2 z-10">
      {/* Route Button */}
      <button
        onClick={onToggleRouting}
        className={`p-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all border ${
          isRoutingMode 
            ? "bg-primary text-white border-primary" 
            : "bg-white/95 border-gray-200 hover:bg-primary hover:text-white"
        }`}
        title="Route Planner"
      >
        <Route className="w-5 h-5" />
      </button>

      {/* GPS Tracking Toggle */}
      <button
        onClick={onToggleTracking}
        className={`p-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all border ${
          isTracking 
            ? "bg-blue-500 text-white border-blue-500" 
            : "bg-white/95 border-gray-200 hover:bg-blue-500 hover:text-white"
        }`}
        title={isTracking ? "Stop GPS Tracking" : "Start GPS Tracking"}
      >
        {isTracking ? (
          <RadioTower className="w-5 h-5 animate-pulse" />
        ) : (
          <LocateFixed className="w-5 h-5" />
        )}
      </button>

      {/* Follow Mode Toggle (only show when tracking) */}
      {isTracking && (
        <button
          onClick={onToggleFollowMode}
          className={`p-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all border ${
            isFollowMode 
              ? "bg-green-500 text-white border-green-500" 
              : "bg-white/95 border-gray-200 hover:bg-green-500 hover:text-white"
          }`}
          title={isFollowMode ? "Disable Auto-Follow" : "Enable Auto-Follow"}
        >
          <Target className="w-5 h-5" />
        </button>
      )}

      <button
        onClick={onLocateUser}
        disabled={isLocating || isTracking}
        className={`p-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg transition-all border border-gray-200 ${
          isLocating ? "bg-blue-50" : isTracking ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-white"
        }`}
        title="Center on My Location"
      >
        {isLocating ? (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
      </button>
      
      <button
        onClick={onResetView}
        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all border border-gray-200"
        title="Reset to Pakistan"
      >
        <Compass className="w-5 h-5" />
      </button>

      {/* Traffic Layer Toggle */}
      <button
        onClick={onToggleTraffic}
        disabled={trafficLoading}
        className={`p-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all border ${
          showTrafficLayer 
            ? "bg-amber-500 text-white border-amber-500" 
            : "bg-white/95 border-gray-200 hover:bg-amber-500 hover:text-white"
        }`}
        title={showTrafficLayer ? "Hide Traffic" : "Show Traffic"}
      >
        {trafficLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Activity className="w-5 h-5" />
        )}
      </button>

      {/* POI Layer Toggle */}
      <button
        onClick={onTogglePOI}
        className={`p-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all border ${
          showPOIPanel || isLoadingPOIs
            ? "bg-purple-500 text-white border-purple-500" 
            : "bg-white/95 border-gray-200 hover:bg-purple-500 hover:text-white"
        }`}
        title="Points of Interest"
      >
        {isLoadingPOIs ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
      </button>

      {/* Measurement Tools */}
      <div className="flex flex-col gap-1 p-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <button
          onClick={() => onToggleMeasure("distance")}
          className={`p-2 rounded-md transition-all ${
            measureMode === "distance" 
              ? "bg-indigo-500 text-white" 
              : "hover:bg-gray-100"
          }`}
          title="Measure Distance"
        >
          <Ruler className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToggleMeasure("area")}
          className={`p-2 rounded-md transition-all ${
            measureMode === "area" 
              ? "bg-indigo-500 text-white" 
              : "hover:bg-gray-100"
          }`}
          title="Measure Area"
        >
          <Square className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={onToggleLayerPanel}
        className={`p-2.5 backdrop-blur-sm rounded-lg shadow-lg transition-all border ${
          showLayerPanel 
            ? "bg-primary text-white border-primary" 
            : "bg-white/95 border-gray-200 hover:bg-primary hover:text-white"
        }`}
        title="Layers"
      >
        <Layers className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NavigationControls;
