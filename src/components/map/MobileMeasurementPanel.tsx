import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Square, X, PenTool, Trash2, Info } from "lucide-react";
import type { MeasureMode } from "./types";
import { formatDistance, formatArea } from "./utils";
import { Z_INDEX } from "../../lib/z-index";

interface MobileMeasurementPanelProps {
  show: boolean;
  measureMode: MeasureMode;
  measurePoints: [number, number][];
  measureResult: { distance?: number; area?: number } | null;
  onClose: () => void;
  onClear: () => void;
}

const MobileMeasurementPanel = ({
  show,
  measureMode,
  measurePoints,
  measureResult,
  onClose,
  onClear,
}: MobileMeasurementPanelProps) => {
  if (measureMode === "none") return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            style={{ zIndex: Z_INDEX.SECONDARY_PANEL_BACKDROP }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[50vh] overflow-hidden"
            style={{ zIndex: Z_INDEX.SECONDARY_PANEL }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  {measureMode === "distance" ? (
                    <Ruler className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Square className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {measureMode === "distance" ? "Distance Measurement" : "Area Measurement"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {measurePoints.length} point{measurePoints.length !== 1 ? 's' : ''} placed
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Close measurement panel"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Instructions */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  {measureMode === "distance" 
                    ? "Tap on the map to add points. The total distance between all points will be calculated."
                    : "Tap on the map to add at least 3 points to calculate the enclosed area."
                  }
                </div>
              </div>

              {/* Current Status */}
              {measurePoints.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="p-2 bg-white rounded-xl">
                    <PenTool className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {measurePoints.length} Point{measurePoints.length !== 1 ? 's' : ''} Added
                    </div>
                    <div className="text-sm text-gray-500">
                      {measureMode === "area" && measurePoints.length < 3 
                        ? `Add ${3 - measurePoints.length} more point${3 - measurePoints.length !== 1 ? 's' : ''} for area calculation`
                        : "Tap map to add more points"
                      }
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              {measureResult && (
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-sm text-indigo-600 font-medium mb-2">
                      {measureMode === "distance" ? "Total Distance" : "Total Area"}
                    </div>
                    <div className="text-3xl font-bold text-indigo-700 mb-1">
                      {measureMode === "distance" && measureResult.distance !== undefined
                        ? formatDistance(measureResult.distance)
                        : measureResult.area !== undefined
                        ? formatArea(measureResult.area)
                        : "-"
                      }
                    </div>
                    <div className="text-xs text-indigo-500">
                      Based on {measurePoints.length} measurement points
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {measurePoints.length > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={onClear}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-medium transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear All Points
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Measurements are approximate and based on map projection
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMeasurementPanel;