import React from "react";
import { motion } from "framer-motion";

interface MapProps {
  // Props si nécessaire
}

const Map: React.FC<MapProps> = () => {
  return (
    <motion.section
      className="py-10 px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="bg-black rounded-xl overflow-hidden border border-[#d4af37]/20 shadow-lg shadow-[#d4af37]/5"
          whileHover={{ boxShadow: "0 0 20px 0 rgba(212, 175, 55, 0.1)" }}
        >
          <div className="p-8 pb-0">
            <motion.h2
              className="text-2xl font-serif text-[#d4af37] mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Nous Trouver
            </motion.h2>
            <motion.p
              className="text-gray-400 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Venez découvrir nos parfums dans notre boutique
            </motion.p>
          </div>
          <motion.div
            className="h-96 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Ici vous pourriez intégrer une carte interactive comme Google Maps, Mapbox, etc. */}
            <div className="w-full h-full bg-black border-t border-[#d4af37]/10 flex items-center justify-center">
              <p className="text-gray-400">
                Carte interactive sera affichée ici
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Map;
