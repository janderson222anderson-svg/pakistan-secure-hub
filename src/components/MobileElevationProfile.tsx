import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Mountain, ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Z_INDEX } from "../lib/z-index";

interface ElevationPoint {
  distance: number;
  elevation: number;
}

interface MobileElevationProfileProps {
  show: boolean;
  routeCoordinates: [number, number][];
  onClose: () => void;
  isLoading?: boolean;
  elevationData?: ElevationPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ElevationPoint;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-lg text-sm">
        <div className="flex items-center gap-2 mb-1">
          <Mountain className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{data.elevation.toFixed(0)}m</span>
        </div>
        <div className="text-gray-300 text-xs">
          {data.distance.toFixed(2)} km from start
        </div>
      </div>
    );
  }
  return null;
};

const MobileElevationProfile = ({
  show,
  onClose,
  isLoading = false,
  elevationData = [],
}: MobileElevationProfileProps) => {
  // Calculate statistics
  const stats = useMemo(() => {
    if (elevationData.length === 0) {
      return { min: 0, max: 0, totalGain: 0, totalLoss: 0, avgGrade: 0 };
    }

    let min = Infinity;
    let max = -Infinity;
    let totalGain = 0;
    let totalLoss = 0;

    elevationData.forEach((point, index) => {
      if (point.elevation < min) min = point.elevation;
      if (point.elevation > max) max = point.elevation;

      if (index > 0) {
        const diff = point.elevation - elevationData[index - 1].elevation;
        if (diff > 0) totalGain += diff;
        else totalLoss += Math.abs(diff);
      }
    });

    const totalDistance = elevationData.length > 0 
      ? elevationData[elevationData.length - 1].distance 
      : 0;
    const elevationChange = elevationData.length > 0 
      ? elevationData[elevationData.length - 1].elevation - elevationData[0].elevation 
      : 0;
    const avgGrade = totalDistance > 0 
      ? (elevationChange / (totalDistance * 1000)) * 100 
      : 0;

    return { min, max, totalGain, totalLoss, avgGrade };
  }, [elevationData]);

  const getGradeIcon = (grade: number) => {
    if (grade > 2) return <ArrowUp className="w-4 h-4 text-red-500" />;
    if (grade < -2) return <ArrowDown className="w-4 h-4 text-blue-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

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
            style={{ zIndex: Z_INDEX.OVERLAY_PANEL_BACKDROP }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden"
            style={{ zIndex: Z_INDEX.OVERLAY_PANEL }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-green-600 text-white">
              <div className="flex items-center gap-3">
                <Mountain className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Elevation Profile</h3>
                  <p className="text-sm text-green-100">Route elevation analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                aria-label="Close elevation profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-500">Loading elevation data...</span>
                    </div>
                  </div>
                ) : elevationData.length === 0 ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <Mountain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <span className="text-gray-500">No elevation data available</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chart */}
                    <div className="h-48 w-full mb-6 bg-gray-50 rounded-2xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={elevationData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="distance"
                            tickFormatter={(val) => `${val.toFixed(0)}km`}
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                            axisLine={{ stroke: "#e5e7eb" }}
                            tickLine={false}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            tickFormatter={(val) => `${val}m`}
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            domain={["dataMin - 50", "dataMax + 50"]}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="elevation"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="url(#elevationGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-700 mb-1">
                          +{stats.totalGain.toFixed(0)}m
                        </div>
                        <div className="text-sm text-emerald-600">Elevation Gain</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="text-2xl font-bold text-red-700 mb-1">
                          -{stats.totalLoss.toFixed(0)}m
                        </div>
                        <div className="text-sm text-red-600">Elevation Loss</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <ArrowUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-700 mb-1">
                          {stats.max.toFixed(0)}m
                        </div>
                        <div className="text-sm text-blue-600">Max Elevation</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          {getGradeIcon(stats.avgGrade)}
                        </div>
                        <div className="text-2xl font-bold text-purple-700 mb-1">
                          {stats.avgGrade > 0 ? "+" : ""}{stats.avgGrade.toFixed(1)}%
                        </div>
                        <div className="text-sm text-purple-600">Avg Grade</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 text-center">
                  Elevation data from Open-Meteo API
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileElevationProfile;