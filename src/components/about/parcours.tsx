import React from "react";
import { motion, easeOut, easeInOut } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import

const Parcours: React.FC = () => {
  const { t, i18n } = useTranslation(); // Ajout hook

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

  // Les événements de la timeline (traduits dynamiquement)
  const events = [
    {
      title: t("about.timeline.heritage.title"),
      subtitle: t("about.timeline.heritage.subtitle"),
      content: t("about.timeline.heritage.content"),
    },
    {
      title: t("about.timeline.formation.title"),
      subtitle: t("about.timeline.formation.subtitle"),
      content: t("about.timeline.formation.content"),
    },
    {
      title: t("about.timeline.jan2025.title"),
      subtitle: t("about.timeline.jan2025.subtitle"),
      content: t("about.timeline.jan2025.content"),
    },
    {
      title: t("about.timeline.may2025.title"),
      subtitle: t("about.timeline.may2025.subtitle"),
      content: t("about.timeline.may2025.content"),
    },
    {
      title: t("about.timeline.today.title"),
      subtitle: t("about.timeline.today.subtitle"),
      content: t("about.timeline.today.content"),
    },
  ];

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
          {t("about.timelineTitle")}
        </motion.h2>

        {/* Timeline Responsive */}
        <div className="relative">
          {/* Desktop timeline (centrée) */}
          <div className="hidden md:block">
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-white/30"
              variants={lineVariants}
            ></motion.div>
            <div className="space-y-24 relative">
              {events.map((event, idx) => (
                <div
                  key={event.title + idx}
                  className={`flex flex-col md:flex-row items-center`}
                >
                  {idx % 2 === 0 ? (
                    <>
                      <motion.div
                        className="flex-1 md:text-right md:pr-12 mb-6 md:mb-0"
                        variants={eventVariants}
                        custom={idx}
                      >
                        <h3 className="text-2xl font-serif text-white">
                          {event.title}
                        </h3>
                        <h4 className="text-xl text-gray-200 mb-3">
                          {event.subtitle}
                        </h4>
                        <p className="text-gray-400">{event.content}</p>
                      </motion.div>
                      <motion.div
                        className="w-6 h-6 rounded-full bg-white z-10 my-4 md:my-0"
                        variants={dotVariants}
                        custom={idx}
                      ></motion.div>
                      <div className="flex-1 md:pl-12"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 md:text-right md:pr-12 md:hidden"></div>
                      <motion.div
                        className="w-6 h-6 rounded-full bg-white z-10 my-4 md:my-0"
                        variants={dotVariants}
                        custom={idx}
                      ></motion.div>
                      <motion.div
                        className="flex-1 md:pl-12"
                        variants={eventVariants}
                        custom={idx}
                      >
                        <h3 className="text-2xl font-serif text-white">
                          {event.title}
                        </h3>
                        <h4 className="text-xl text-gray-200 mb-3">
                          {event.subtitle}
                        </h4>
                        <p className="text-gray-400">{event.content}</p>
                      </motion.div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile timeline (ligne à droite du texte) */}
          <div className="block md:hidden">
            <div className="relative flex flex-col gap-16">
              {/* Ligne verticale à droite */}
              <motion.div
                className="absolute top-0 right-3 h-full w-px bg-white/30 z-0"
                variants={lineVariants}
              ></motion.div>
              {events.map((event, idx) => (
                <motion.div
                  key={event.title + idx}
                  className="flex items-start relative z-10"
                  variants={eventVariants}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Texte à gauche */}
                  <div className="flex-1 pr-8">
                    <h3 className="text-xl font-serif text-white mb-1">
                      {event.title}
                    </h3>
                    <h4 className="text-base text-gray-200 mb-2">
                      {event.subtitle}
                    </h4>
                    <p className="text-gray-400 text-sm">{event.content}</p>
                  </div>
                  {/* Dot sur la ligne */}
                  <motion.div
                    className="w-5 h-5 rounded-full bg-white z-10 mt-2"
                    style={{ marginLeft: "-10px" }}
                    variants={dotVariants}
                    custom={idx}
                  ></motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Parcours;
