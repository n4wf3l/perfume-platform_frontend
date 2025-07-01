import React from "react";
import { motion, easeOut, easeInOut } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import

const Header: React.FC = () => {
  const { t } = useTranslation(); // Ajout hook

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
        className="font-serif italic text-5xl md:text-7xl mb-8 text-white pt-40"
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
        {t("about.brandDescription")}
      </motion.p>

      {/* Ligne horizontale avec "BIOGRAPHIE" */}
      <motion.div className="relative max-w-4xl mx-auto my-12">
        <motion.div className="absolute inset-0 flex items-center">
          <motion.div
            className="w-full border-t border-white/30"
            variants={lineVariants}
          ></motion.div>
        </motion.div>
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="bg-black px-8 text-white text-sm tracking-widest uppercase">
            {t("about.biography")}
          </span>
        </motion.div>
      </motion.div>

      {/* Texte biographique */}
      <div className="max-w-3xl mx-auto text-gray-300 leading-relaxed">
        <motion.p className="mb-6" custom={0} variants={paragraphVariants}>
          {t("about.bioParagraph1")}
        </motion.p>
        <motion.p className="mb-6" custom={1} variants={paragraphVariants}>
          {t("about.bioParagraph2")}
        </motion.p>
        <motion.p className="mb-6" custom={2} variants={paragraphVariants}>
          {t("about.bioParagraph3")}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Header;
