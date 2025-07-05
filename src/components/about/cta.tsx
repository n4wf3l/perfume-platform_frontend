import React from "react";
import { Link } from "react-router-dom";
import { motion, easeInOut } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import

const CTA: React.FC = () => {
  const { t } = useTranslation(); // Ajout hook

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 15px rgba(255,255,255,0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.98 },
  };

  const glowVariants: Variants = {
    hover: {
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-b from-black to-gray-900"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <motion.div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-white mb-6"
          variants={childVariants}
        >
          {t("about.ctaTitle")}
        </motion.h2>
        <motion.p
          className="text-gray-300 text-lg mb-10"
          variants={childVariants}
        >
          {t("about.ctaText")}
        </motion.p>
        <motion.div
          className="inline-block relative"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <motion.div
            className="absolute -inset-1 bg-white rounded-lg blur opacity-30"
            variants={glowVariants}
          ></motion.div>
          <Link
            to="/contact"
            className="relative bg-black hover:bg-gray-900 border border-white/50 text-white px-10 py-4 rounded-lg transition-colors duration-300 text-lg inline-block"
          >
            {t("about.ctaButton")}
          </Link>
        </motion.div>

        {/* Élément décoratif animé */}
        <motion.div
          className="mt-16 opacity-20"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
            y: [0, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: easeInOut,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            className="mx-auto text-white"
          >
            <path
              fill="currentColor"
              d="M12 2L9.91 4.5h2.19l-2.4 6.6L12 9.5l-7 8.5L12 14.5l-2 4.5h4l4-11-3.09 1.5 4.09-7H12z"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CTA;
