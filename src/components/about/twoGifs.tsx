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
        ></motion.h2>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* Premier GIF */}

          {/* Deuxième GIF */}
        </div>
      </div>
    </section>
  );
};

export default TwoGifs;
