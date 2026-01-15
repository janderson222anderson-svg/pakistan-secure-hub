import { ZoomIn, ZoomOut, Maximize2, Compass } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
  onResetNorth: () => void;
}

const MapControls = ({ onZoomIn, onZoomOut, onFullscreen, onResetNorth }: MapControlsProps) => {
  return (
    <div className="absolute right-4 top-20 flex flex-col gap-2 z-10">
      <button
        onClick={onZoomIn}
        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all border border-gray-200"
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all border border-gray-200"
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
      <button
        onClick={onFullscreen}
        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all border border-gray-200"
        title="Fullscreen"
      >
        <Maximize2 className="w-5 h-5" />
      </button>
      <button
        onClick={onResetNorth}
        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all border border-gray-200"
        title="Reset North"
      >
        <Compass className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MapControls;
