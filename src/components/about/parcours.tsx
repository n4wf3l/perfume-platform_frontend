import React from "react";
import { motion, easeOut, easeInOut } from "framer-motion";
import type { Variants } from "framer-motion";

const Parcours: React.FC = () => {
  // Animation pour le titre avec typage correct
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  // Animation pour la ligne de chronologie avec typage correct
  const lineVariants: Variants = {
    hidden: { height: "0%" },
    visible: {
      height: "100%",
      transition: { delay: 0.5, duration: 1.8, ease: easeInOut },
    },
  };

  // Animation pour les événements avec typage correct
  const eventVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + custom * 0.2,
        duration: 0.8,
        ease: easeOut,
      },
    }),
  };

  // Animation pour les points de la chronologie avec typage correct
  const dotVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.6 + custom * 0.2,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    }),
  };

  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-white mb-12 text-center"
          variants={titleVariants}
        >
          Notre Parcours
        </motion.h2>

        <div className="relative">
          {/* Ligne de chronologie animée */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-white/30"
            variants={lineVariants}
          ></motion.div>

          {/* Événements chronologiques */}
          <div className="space-y-24 relative">
            {/* Héritage familial */}
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="flex-1 md:text-right md:pr-12 mb-6 md:mb-0"
                variants={eventVariants}
                custom={0}
              >
                <h3 className="text-2xl font-serif text-white">Héritage</h3>
                <h4 className="text-xl text-gray-200 mb-3">
                  Racines artistiques
                </h4>
                <p className="text-gray-400">
                  Alessandro Romano grandit dans une famille d'artisans
                  italiens, où il développe une sensibilité olfactive unique
                  auprès de son grand-père, parfumeur amateur passionné. Cette
                  immersion précoce dans l'univers des essences naturelles forge
                  sa vision.
                </p>
              </motion.div>
              <motion.div
                className="w-6 h-6 rounded-full bg-white z-10 my-4 md:my-0"
                variants={dotVariants}
                custom={0}
              ></motion.div>
              <div className="flex-1 md:pl-12"></div>
            </div>

            {/* Formation */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 md:text-right md:pr-12 md:hidden"></div>
              <motion.div
                className="w-6 h-6 rounded-full bg-white z-10 my-4 md:my-0"
                variants={dotVariants}
                custom={1}
              ></motion.div>
              <motion.div
                className="flex-1 md:pl-12"
                variants={eventVariants}
                custom={1}
              >
                <h3 className="text-2xl font-serif text-white">Formation</h3>
                <h4 className="text-xl text-gray-200 mb-3">
                  L'apprentissage de l'excellence
                </h4>
                <p className="text-gray-400">
                  Après des études à l'Institut de Parfumerie de Grasse et une
                  décennie comme nez au service de grandes maisons françaises et
                  italiennes, Alessandro affine son expertise et sa
                  compréhension profonde des essences rares.
                </p>
              </motion.div>
            </div>

            {/* La création */}
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="flex-1 md:text-right md:pr-12 mb-6 md:mb-0"
                variants={eventVariants}
                custom={2}
              >
                <h3 className="text-2xl font-serif text-white">Janvier 2025</h3>
                <h4 className="text-xl text-gray-200 mb-3">
                  Naissance de Sogno D'Oro
                </h4>
                <p className="text-gray-400">
                  Alessandro fonde Sogno D'Oro à Florence, avec une vision
                  claire : créer des parfums qui transcendent les tendances
                  éphémères pour devenir des signatures olfactives
                  intemporelles. Un petit atelier dans le quartier historique
                  devient le laboratoire de ses premières créations.
                </p>
              </motion.div>
              <motion.div
                className="w-6 h-6 rounded-full bg-white z-10 my-4 md:my-0"
                variants={dotVariants}
                custom={2}
              ></motion.div>
              <div className="flex-1 md:pl-12"></div>
            </div>

            {/* Première collection */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 md:text-right md:pr-12 md:hidden"></div>
              <motion.div
                className="w-6 h-6 rounded-full bg-white z-10 my-4 md:my-0"
                variants={dotVariants}
                custom={3}
              ></motion.div>
              <motion.div
                className="flex-1 md:pl-12"
                variants={eventVariants}
                custom={3}
              >
                <h3 className="text-2xl font-serif text-white">Mai 2025</h3>
                <h4 className="text-xl text-gray-200 mb-3">
                  Première Collection
                </h4>
                <p className="text-gray-400">
                  Lancement de notre collection inaugurale "Essenza Prima" avec
                  trois fragrances distinctives, présentées lors d'un événement
                  intimiste à Florence qui attire l'attention de connaisseurs et
                  d'éditeurs spécialisés en parfumerie de niche.
                </p>
              </motion.div>
            </div>

            {/* Aujourd'hui et demain */}
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="flex-1 md:text-right md:pr-12 mb-6 md:mb-0"
                variants={eventVariants}
                custom={4}
              >
                <h3 className="text-2xl font-serif text-white">
                  Aujourd'hui et Demain
                </h3>
                <h4 className="text-xl text-gray-200 mb-3">
                  Une vision en développement
                </h4>
                <p className="text-gray-400">
                  Nous travaillons actuellement sur l'ouverture de notre
                  première boutique permanente à Florence et sur le
                  développement de nouvelles fragrances. Notre engagement envers
                  l'excellence et la durabilité guide chaque étape de notre
                  jeune maison, avec l'ambition de faire rayonner
                  internationalement l'art parfumé italien.
                </p>
              </motion.div>
              <motion.div
                className="w-6 h-6 rounded-full bg-white z-10 my-4 md:my-0"
                variants={dotVariants}
                custom={4}
              ></motion.div>
              <div className="flex-1 md:pl-12"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Parcours;
