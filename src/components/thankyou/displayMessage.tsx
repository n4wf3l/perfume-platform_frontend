import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const successIconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const, // <-- Ajoute "as const" ici
      stiffness: 260,
      damping: 20,
      delay: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" as const },
  },
};

export default function DisplayMessage() {
  const { t } = useTranslation();
  return (
    <motion.div className="text-center mb-12">
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 mb-6"
        variants={successIconVariants}
        initial="hidden"
        animate="visible"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </motion.div>
      <motion.h1
        className="text-4xl font-serif text-[#d4af37] mb-4"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        {t("thankYou.title")}
      </motion.h1>
      <motion.p
        className="text-gray-300 text-lg max-w-2xl mx-auto"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        {t("thankYou.desc")}
      </motion.p>
    </motion.div>
  );
}
