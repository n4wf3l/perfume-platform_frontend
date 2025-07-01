import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import

const TwoGifs: React.FC = () => {
  const { t } = useTranslation(); // Ajout hook

  return (
    <section
      className="py-16 relative"
      style={{
        backgroundImage: "url('/aboutcover2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-center text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {t("about.twoGifsTitle")}
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* Premier GIF */}
          <motion.div
            className="w-full md:w-1/2 max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="overflow-hidden rounded-lg shadow-lg shadow-white/20">
              <img
                src="/parfumgif.webp"
                alt={t("about.twoGifsFirstAlt")}
                className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-700"
              />
              <div className="p-4 bg-black backdrop-blur-sm">
                <h3 className="text-lg font-serif text-white">
                  {t("about.twoGifsFirstTitle")}
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  {t("about.twoGifsFirstText")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Deuxième GIF */}
          <motion.div
            className="w-full md:w-1/2 max-w-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="overflow-hidden rounded-lg shadow-lg shadow-white/20">
              <img
                src="/parfumgif.webp"
                alt={t("about.twoGifsSecondAlt")}
                className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-700"
              />
              <div className="p-4 bg-black backdrop-blur-sm">
                <h3 className="text-lg font-serif text-white">
                  {t("about.twoGifsSecondTitle")}
                </h3>
                <p className="text-gray-300 text-sm mt-2">
                  {t("about.twoGifsSecondText")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TwoGifs;
