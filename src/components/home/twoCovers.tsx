import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TwoCoversProps {
  title1?: string;
  subtitle1?: string;
  buttonText1?: string;
  title2?: string;
  subtitle2?: string;
  buttonText2?: string;
}

const TwoCovers: React.FC<TwoCoversProps> = ({
  title1 = "Collection Homme",
  subtitle1 = "Des fragrances intenses et sophistiquées, pour l'homme qui affirme sa personnalité.",
  buttonText1 = "Découvrir",
  title2 = "Collection Femme",
  subtitle2 = "Des parfums élégants et captivants, qui révèlent la féminité sous toutes ses facettes.",
  buttonText2 = "Explorer",
}) => {
  const firstCoverRef = useRef(null);
  const secondCoverRef = useRef(null);

  const firstCoverInView = useInView(firstCoverRef, {
    once: true,
    margin: "-100px",
  });
  const secondCoverInView = useInView(secondCoverRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <>
      {/* Premier cover */}
      <div
        ref={firstCoverRef}
        className="w-full h-[500px] relative flex items-center justify-center mb-0"
        style={{
          backgroundImage: "url('/sectioncover1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.div
          className="relative z-10 text-center px-6 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={
            firstCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-serif text-[#d4af37] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={
              firstCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {title1}
          </motion.h2>
          <motion.p
            className="text-lg text-white mb-8"
            initial={{ opacity: 0 }}
            animate={firstCoverInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {subtitle1}
          </motion.p>
          <motion.button
            className="px-8 py-3 bg-[#c5a028] hover:bg-[#b08c15] text-black font-medium rounded transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={
              firstCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {buttonText1}
          </motion.button>
        </motion.div>
      </div>

      {/* Deuxième cover */}
      <div
        ref={secondCoverRef}
        className="w-full h-[500px] relative flex items-center justify-center mb-16"
        style={{
          backgroundImage: "url('/sectioncover2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.div
          className="relative z-10 text-center px-6 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={
            secondCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-serif text-[#d4af37] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={
              secondCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {title2}
          </motion.h2>
          <motion.p
            className="text-lg text-white mb-8"
            initial={{ opacity: 0 }}
            animate={secondCoverInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {subtitle2}
          </motion.p>
          <motion.button
            className="px-8 py-3 bg-[#c5a028] hover:bg-[#b08c15] text-black font-medium rounded transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={
              secondCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {buttonText2}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default TwoCovers;
