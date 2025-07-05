import React from "react";
import { Link } from "react-router-dom";
import { motion, cubicBezier, easeInOut, spring } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import

const History: React.FC = () => {
  const { t } = useTranslation(); // Ajout hook

  // Variants pour l'animation des éléments textuels avec typage correct
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.8,
        ease: cubicBezier(0.42, 0, 0.58, 1), // cubic-bezier pour "easeOut"
      },
    }),
  };

  // Variants pour l'animation des images avec typage correct
  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easeInOut,
      },
    },
  };

  // Variant pour l'animation de l'image secondaire avec typage correct
  const secondImageVariants: Variants = {
    hidden: { opacity: 0, x: 30, y: 30 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      id="history-section"
      className="py-20 px-4 scroll-mt-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="md:text-left text-center flex flex-col items-center md:items-start">
            <motion.h2
              className="text-3xl md:text-4xl font-serif text-white mb-6"
              variants={textVariants}
              custom={0}
            >
              {t("about.historyTitle")}
            </motion.h2>
            <div className="space-y-4 w-full">
              <motion.p
                className="text-gray-300 leading-relaxed md:text-left text-center"
                variants={textVariants}
                custom={1}
              >
                {t("about.historyParagraph1")}
              </motion.p>
              <motion.p
                className="text-gray-300 leading-relaxed md:text-left text-center"
                variants={textVariants}
                custom={2}
              >
                {t("about.historyParagraph2")}
              </motion.p>
              <motion.p
                className="text-gray-300 leading-relaxed md:text-left text-center"
                variants={textVariants}
                custom={3}
              >
                {t("about.historyParagraph3")}
              </motion.p>
            </div>
            <motion.div
              className="mt-8 inline-block relative w-full md:w-auto"
              variants={textVariants}
              custom={4}
            >
              <div className="absolute -inset-1 bg-white rounded-lg blur opacity-25"></div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  to="/shop"
                  className="relative bg-gray-900 hover:bg-gray-800 border border-white/50 text-white px-8 py-3 rounded-lg transition-all duration-300 block mx-auto md:mx-0"
                >
                  {t("about.historyButton")}
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <div className="relative">
            <motion.div
              className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden"
              variants={imageVariants}
            >
              <img
                src="/perfum1.jpg"
                alt="Fondateur"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 -right-6 w-48 h-48 bg-gray-900 rounded-lg overflow-hidden border border-white/30"
              variants={secondImageVariants}
            >
              <img
                src="/perfum2.jpg"
                alt="Fabrication traditionnelle de parfum"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default History;
