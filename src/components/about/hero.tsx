import React, { useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const Hero: React.FC = () => {
  // Ajout de CSS pour un défilement fluide
  useEffect(() => {
    // On ajoute un style global pour assurer le défilement doux sur toutes les ancres
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      html {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Variantes d'animation pour les éléments du Hero avec typage correct
  const titleVariant: Variants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
        duration: 1,
      },
    },
  };

  const subtitleVariant: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        delay: 0.6,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.section
      className="relative h-screen overflow-hidden bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/aboutcover.jpg')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Overlay sombre pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      <div className="relative z-20 flex flex-col justify-center items-center h-full text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-serif text-[#d4af37] mb-6 tracking-tight"
          variants={titleVariant}
          initial="hidden"
          animate="visible"
        >
          L'Art du Parfum
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed"
          variants={subtitleVariant}
          initial="hidden"
          animate="visible"
        >
          Découvrez l'histoire et l'inspiration derrière nos créations parfumées
        </motion.p>

        {/* Flèche avec un anchor link vers le Header - animation avancée */}
        <motion.a
          href="#brand-header"
          className="mt-16 cursor-pointer focus:outline-none hover:scale-110 transition-transform duration-300"
          aria-label="Défiler vers la présentation de notre marque"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          whileHover={{ scale: 1.2 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#d4af37]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{
              y: [0, 8, 0],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </motion.a>
      </div>
    </motion.section>
  );
};

export default Hero;
