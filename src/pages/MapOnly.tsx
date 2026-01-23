import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X } from "lucide-react";
import FullScreenMapViewer from "@/components/FullScreenMapViewer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MapViewer from "@/components/MapViewer";
import Timeline from "@/components/Timeline";
import TechStack from "@/components/TechStack";
import TeamStructure from "@/components/TeamStructure";
import Footer from "@/components/Footer";

const MapOnly = () => {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Map View - Full Screen */}
      <div className="h-screen w-full">
        <FullScreenMapViewer showDocsButton={true} onDocsClick={() => setShowDocs(true)} />
      </div>

      {/* Full Website Overlay */}
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

            {/* Full Website Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="min-h-screen"
            >
              <Header />
              <Hero />
              <Features />
              
              {/* Map Section with Note */}
              <MapViewer />
              
              <Timeline />
              <TechStack />
              <TeamStructure />
              <Footer />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapOnly;