import { motion, AnimatePresence } from "framer-motion";
import { Layers, X, Check } from "lucide-react";
import { Z_INDEX } from "../../lib/z-index";

type MapStyle = "streets" | "satellite" | "terrain";

interface MobileLayerPanelProps {
  show: boolean;
  activeStyle: MapStyle;
  onClose: () => void;
  onStyleChange: (style: MapStyle) => void;
}

const mapStyles: Record<MapStyle, { name: string; description: string }> = {
  streets: { 
    name: "Streets", 
    description: "Standard street map with roads and labels" 
  },
  satellite: { 
    name: "Satellite", 
    description: "High-resolution satellite imagery" 
  },
  terrain: { 
    name: "Terrain", 
    description: "Topographic map with elevation details" 
  },
};

const MobileLayerPanel = ({ show, activeStyle, onClose, onStyleChange }: MobileLayerPanelProps) => {
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
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-hidden"
            style={{ zIndex: Z_INDEX.SECONDARY_PANEL }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Map Layers</h3>
                  <p className="text-sm text-gray-500">Choose your preferred map style</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Close layer panel"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(60vh-80px)]">
              {(Object.keys(mapStyles) as MapStyle[]).map((style) => {
                const isActive = activeStyle === style;
                return (
                  <motion.button
                    key={style}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onStyleChange(style);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all ${
                      isActive 
                        ? "bg-primary text-white shadow-lg" 
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-white/20" : "bg-white"
                    }`}>
                      {style === "streets" && (
                        <svg className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      )}
                      {style === "satellite" && (
                        <svg className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {style === "terrain" && (
                        <svg className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold mb-1 ${isActive ? "text-white" : "text-gray-900"}`}>
                        {mapStyles[style].name}
                      </div>
                      <div className={`text-sm ${isActive ? "text-white/80" : "text-gray-500"}`}>
                        {mapStyles[style].description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Map styles powered by CARTO and OpenStreetMap
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileLayerPanel;