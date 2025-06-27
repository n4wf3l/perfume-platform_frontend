import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Link } from "react-router-dom";

const backgroundVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0, 0, 0.58, 1],
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.5,
      duration: 0.4,
      ease: [0, 0, 0.58, 1],
    },
  },
  hover: {
    scale: 1.05,
    boxShadow:
      "0 10px 15px -3px rgba(255,255,255,0.2), 0 4px 6px -2px rgba(255,255,255,0.1)",
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.58, 1],
    },
  },
  tap: {
    scale: 0.98,
  },
};

const BottomCover: React.FC = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="relative h-[32rem] md:h-[40rem] lg:h-[45rem] overflow-hidden"
    >
      <motion.div
        variants={backgroundVariants}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/cartcover.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      />
      <motion.div
        className="absolute inset-0 bg-black/50"
        variants={backgroundVariants}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <motion.h2
          variants={textVariants}
          className="text-3xl md:text-4xl font-serif text-white mb-6 text-center"
        >
          Une expérience olfactive d'exception
        </motion.h2>
        <motion.p
          variants={textVariants}
          custom={1}
          className="text-lg md:text-xl text-white text-center max-w-2xl mb-8"
        >
          Laissez-vous séduire par notre collection de parfums raffinés, créés
          avec les matières premières les plus nobles.
        </motion.p>
        <motion.div
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="mt-6"
        >
          <Link
            to="/shop"
            className="px-8 py-4 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-colors duration-300 text-lg"
          >
            Découvrir notre collection
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BottomCover;
