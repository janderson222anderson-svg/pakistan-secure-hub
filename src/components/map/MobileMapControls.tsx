import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Maximize, 
  Navigation, 
  RotateCcw,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Z_INDEX } from "../../lib/z-index";

interface MobileMapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
  onResetNorth: () => void;
  onResetView: () => void;
  onToggleMenu: () => void;
  showMenu: boolean;
}

const MobileMapControls = ({
  onZoomIn,
  onZoomOut,
  onFullscreen,
  onResetNorth,
  onResetView,
  onToggleMenu,
  showMenu,
}: MobileMapControlsProps) => {
  return (
    <>
      {/* Main Controls - Always Visible */}
      <div className="absolute right-4 top-4 flex flex-col gap-2" style={{ zIndex: Z_INDEX.MAP_CONTROLS }}>
        {/* Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleMenu}
          className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {showMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>

        {/* Zoom Controls */}
        <div className="flex flex-col gap-1 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onZoomIn}
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
          <div className="w-full h-px bg-gray-200" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onZoomOut}
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Expandable Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2 min-w-[120px]"
            style={{ zIndex: Z_INDEX.MAP_CONTROLS - 5 }}
          >
            <div className="flex flex-col gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onResetNorth();
                  onToggleMenu();
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span className="text-sm font-medium">Reset North</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onResetView();
                  onToggleMenu();
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Reset View</span>
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onFullscreen();
                  onToggleMenu();
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-left text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Maximize className="w-4 h-4" />
                <span className="text-sm font-medium">Fullscreen</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMapControls;