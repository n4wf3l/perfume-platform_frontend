import React from "react";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";

const Values: React.FC = () => {
  // Typage explicite des variants
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  // Correction du typage pour les variants avec fonction custom
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.1,
        duration: 0.8,
        ease: easeOut,
      },
    }),
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4,
      },
    },
  };

  return (
    <motion.section
      className="py-20 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-[#d4af37] mb-12 text-center"
          variants={titleVariants}
        >
          Nos Valeurs
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Luxe */}
          <motion.div
            variants={cardVariants}
            custom={0}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-black p-8 rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group"
          >
            <motion.div
              className="w-16 h-16 flex items-center justify-center rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-6 group-hover:bg-[#d4af37]/20 transition-all"
              variants={iconVariants}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#d4af37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-serif text-[#d4af37] mb-3">Luxe</h3>
            <p className="text-gray-400">
              Nous nous engageons à offrir des expériences olfactives
              d'exception, grâce à des ingrédients rares et précieux
              sélectionnés avec la plus grande rigueur.
            </p>
          </motion.div>

          {/* Artisanat */}
          <motion.div
            variants={cardVariants}
            custom={1}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-black p-8 rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group"
          >
            <motion.div
              className="w-16 h-16 flex items-center justify-center rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-6 group-hover:bg-[#d4af37]/20 transition-all"
              variants={iconVariants}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#d4af37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-serif text-[#d4af37] mb-3">
              Artisanat
            </h3>
            <p className="text-gray-400">
              Chaque parfum est élaboré à la main selon des méthodes
              traditionnelles, en respectant un savoir-faire transmis depuis des
              générations de maîtres parfumeurs.
            </p>
          </motion.div>

          {/* Durabilité */}
          <motion.div
            variants={cardVariants}
            custom={2}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="bg-black p-8 rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group"
          >
            <motion.div
              className="w-16 h-16 flex items-center justify-center rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 mb-6 group-hover:bg-[#d4af37]/20 transition-all"
              variants={iconVariants}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#d4af37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <h3 className="text-xl font-serif text-[#d4af37] mb-3">
              Durabilité
            </h3>
            <p className="text-gray-400">
              Notre engagement pour l'environnement se traduit par des pratiques
              responsables, du sourcing éthique des ingrédients à la conception
              de flacons recyclables.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Values;
