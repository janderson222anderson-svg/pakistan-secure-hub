import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FullScreenMapViewer from "@/components/FullScreenMapViewer";

const MapOnly = () => {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Map View - Full Screen */}
      <div className="h-screen w-full">
        <FullScreenMapViewer showDocsButton={true} onDocsClick={() => setShowDocs(true)} />
      </div>

      {/* Simple Documentation Overlay */}
      <AnimatePresence>
        {showDocs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDocs(false)}
              className="fixed top-4 right-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Documentation Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="min-h-screen p-8"
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Pakistan Secure Hub - Map Application
                  </h1>
                  <p className="text-xl text-gray-600">
                    Interactive mapping platform with advanced navigation features
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">🗺️ Map Features</h2>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Interactive map with zoom and pan controls</li>
                      <li>• Multiple map styles (Streets, Satellite, Terrain)</li>
                      <li>• Real-time location tracking</li>
                      <li>• Points of Interest (POI) display</li>
                      <li>• Traffic layer visualization</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">🧭 Navigation</h2>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Turn-by-turn route planning</li>
                      <li>• Multiple route alternatives</li>
                      <li>• Voice navigation support</li>
                      <li>• Distance and time calculations</li>
                      <li>• Route saving and loading</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">📊 Analysis Tools</h2>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Elevation profile visualization</li>
                      <li>• Weather data along routes</li>
                      <li>• Distance and area measurement</li>
                      <li>• Geographic search functionality</li>
                      <li>• Route statistics and analytics</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">📱 Mobile Support</h2>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Touch-friendly mobile interface</li>
                      <li>• Responsive design for all devices</li>
                      <li>• Mobile-optimized controls</li>
                      <li>• Gesture-based navigation</li>
                      <li>• Offline functionality support</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-xl p-8 text-center">
                  <h2 className="text-2xl font-semibold mb-4">🚀 Getting Started</h2>
                  <p className="text-gray-600 mb-4">
                    Close this documentation to return to the interactive map. Use the navigation controls 
                    to explore Pakistan's geography, plan routes, and analyze elevation and weather data.
                  </p>
                  <button
                    onClick={() => setShowDocs(false)}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Start Exploring
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapOnly;