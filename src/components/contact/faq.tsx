import React from "react";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";

interface FaqProps {
  // Props si nécessaire
}

const FAQ: React.FC<FaqProps> = () => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeOut },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.section
      className="py-20 px-4"
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
    >
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-3xl font-serif text-white mb-6"
          variants={fadeInUp}
        >
          Questions Fréquentes
        </motion.h2>
        <motion.p className="text-gray-300 mb-10" variants={fadeInUp}>
          Consultez notre section FAQ pour des réponses aux questions les plus
          courantes concernant nos produits et services.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div className="inline-block relative">
            <motion.div
              className="absolute -inset-1 bg-white rounded-lg blur opacity-30"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.02, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            ></motion.div>
            <a
              href="/confidentiality#faq"
              className="relative inline-flex items-center px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded-md transition-colors duration-300"
            >
              Voir la FAQ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default FAQ;
