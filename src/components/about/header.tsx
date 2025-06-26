import React from "react";
import { motion, easeOut, easeInOut } from "framer-motion";
import type { Variants } from "framer-motion";

const Header: React.FC = () => {
  // Variants pour les animations avec typage correct
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2 },
    },
  };

  const paragraphVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.2,
        duration: 0.8,
        ease: easeOut,
      },
    }),
  };

  const lineVariants: Variants = {
    hidden: { width: "0%" },
    visible: {
      width: "100%",
      transition: {
        delay: 0.5,
        duration: 1.5,
        ease: easeInOut,
      },
    },
  };

  return (
    <motion.div
      className="w-full py-12 md:py-20 px-4 bg-black text-center scroll-mt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Nom de la marque en police cursive élégante */}
      <motion.h1
        className="font-serif italic text-5xl md:text-7xl mb-8 text-[#d4af37] pt-40"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        id="brand-header"
      >
        Sogno D'Oro
      </motion.h1>

      {/* Description de la marque */}
      <motion.p
        className="text-sm tracking-wider uppercase max-w-3xl mx-auto mb-16 text-gray-200"
        variants={fadeIn}
      >
        SOGNO D'ORO CONTINUE DE CRÉER DES PRODUITS INATTENDUS QUI INCARNENT
        SOPHISTICATION ULTIME ET LUXE INTEMPOREL.
      </motion.p>

      {/* Ligne horizontale avec "BIOGRAPHIE" */}
      <motion.div className="relative max-w-4xl mx-auto my-12">
        <motion.div className="absolute inset-0 flex items-center">
          <motion.div
            className="w-full border-t border-[#d4af37]/30"
            variants={lineVariants}
          ></motion.div>
        </motion.div>
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="bg-black px-8 text-[#d4af37] text-sm tracking-widest uppercase">
            BIOGRAPHIE
          </span>
        </motion.div>
      </motion.div>

      {/* Texte biographique */}
      <div className="max-w-3xl mx-auto text-gray-300 leading-relaxed">
        <motion.p className="mb-6" custom={0} variants={paragraphVariants}>
          Née au cœur de la tradition parfumière italienne, la maison Sogno
          D'Oro transpose la sensibilité et la vision héritées de ses fondateurs
          dans l'univers du parfum. Une culture de recherche de luxe absolu et
          son approche audacieuse et novatrice définissent la marque Sogno
          D'Oro.
        </motion.p>
        <motion.p className="mb-6" custom={1} variants={paragraphVariants}>
          Chaque création est une œuvre d'art olfactive, alliant savoir-faire
          ancestral et innovation contemporaine, pour offrir une expérience
          sensorielle unique qui transporte l'imaginaire vers des horizons
          inexplorés.
        </motion.p>
        <motion.p className="mb-6" custom={2} variants={paragraphVariants}>
          Notre philosophie repose sur l'idée que le parfum est une forme
          d'expression personnelle, une signature invisible qui raconte une
          histoire unique. À travers nos créations, nous explorons les émotions
          humaines les plus profondes, en nous inspirant de voyages
          extraordinaires, de rencontres mémorables et de paysages envoûtants
          qui stimulent nos sens et nourrissent notre imagination créative.
          Chaque fragrance Sogno D'Oro est le témoignage de cette quête
          d'excellence et d'émotion pure.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Header;
