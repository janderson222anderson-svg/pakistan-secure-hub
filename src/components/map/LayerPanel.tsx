import { motion, AnimatePresence } from "framer-motion";
import { Layers, X } from "lucide-react";

type MapStyle = "streets" | "satellite" | "terrain";

interface LayerPanelProps {
  show: boolean;
  activeStyle: MapStyle;
  onClose: () => void;
  onStyleChange: (style: MapStyle) => void;
}

const mapStyles: Record<MapStyle, { name: string }> = {
  streets: { name: "Streets" },
  satellite: { name: "Satellite" },
  terrain: { name: "Terrain" },
};

const LayerPanel = ({ show, activeStyle, onClose, onStyleChange }: LayerPanelProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute left-20 bottom-20 z-10"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-3 min-w-[180px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-700">Map Layers</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Close"
                aria-label="Close layer panel"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:scale-110 transition-all" />
              </button>
            </div>
            
            <div className="space-y-1">
              {(Object.keys(mapStyles) as MapStyle[]).map((style) => {
                const isActive = activeStyle === style;
                return (
                  <button
                    key={style}
                    onClick={() => {
                      onStyleChange(style);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      isActive 
                        ? "bg-primary text-white" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? "bg-white/20" : "bg-gray-100"
                    }`}>
                      {style === "streets" && (
                        <svg className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      )}
                      {style === "satellite" && (
                        <svg className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {style === "terrain" && (
                        <svg className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
                      {mapStyles[style].name}
                    </span>
                    {isActive && (
                      <svg className="w-4 h-4 ml-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-[10px] text-gray-400">Select map style</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LayerPanel;
