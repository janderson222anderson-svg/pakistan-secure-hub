import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Square, X, PenTool, Trash2 } from "lucide-react";
import type { MeasureMode } from "./types";
import { formatDistance, formatArea } from "./utils";

interface MeasurementPanelProps {
  show: boolean;
  measureMode: MeasureMode;
  measurePoints: [number, number][];
  measureResult: { distance?: number; area?: number } | null;
  onClose: () => void;
  onClear: () => void;
}

const MeasurementPanel = ({
  show,
  measureMode,
  measurePoints,
  measureResult,
  onClose,
  onClear,
}: MeasurementPanelProps) => {
  if (measureMode === "none") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute left-20 bottom-36 z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3 min-w-[220px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {measureMode === "distance" ? (
                  <Ruler className="w-4 h-4 text-indigo-500" />
                ) : (
                  <Square className="w-4 h-4 text-indigo-500" />
                )}
                <span className="text-sm font-semibold text-gray-700">
                  {measureMode === "distance" ? "Distance Measurement" : "Area Measurement"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Close"
                aria-label="Close measurement panel"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:scale-110 transition-all" />
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                {measureMode === "distance" 
                  ? "Click on the map to add points. The total distance will be calculated."
                  : "Click on the map to add at least 3 points to calculate the area."
                }
              </p>
              
              {measurePoints.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <PenTool className="w-3 h-3" />
                  <span>{measurePoints.length} point{measurePoints.length !== 1 ? 's' : ''} placed</span>
                </div>
              )}

              {measureResult && (
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="text-xs text-indigo-600 font-medium mb-1">
                    {measureMode === "distance" ? "Total Distance" : "Total Area"}
                  </div>
                  <div className="text-xl font-bold text-indigo-700">
                    {measureMode === "distance" && measureResult.distance !== undefined
                      ? formatDistance(measureResult.distance)
                      : measureResult.area !== undefined
                      ? formatArea(measureResult.area)
                      : "-"
                    }
                  </div>
                </div>
              )}

              {measurePoints.length > 0 && (
                <button
                  onClick={onClear}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Measurement
                </button>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-[10px] text-gray-400">Click map to add measurement points</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeasurementPanel;
