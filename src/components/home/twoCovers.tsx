import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getImageSource } from "../../utils/imageUtils";

const TwoCovers: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  // Ajout des handlers pour filtrer par genre
  const goToMen = () => {
    navigate("/shop?gender=homme");
  };
  const goToWomen = () => {
    navigate("/shop?gender=femme");
  };

  return (
    <>
      {/* Premier cover */}
      <div
        ref={firstCoverRef}
        className="w-full h-[500px] relative flex items-center justify-center mb-0"
        style={{
          backgroundImage: `url('${getImageSource(
            "sectioncover1.jpg",
            false
          )}')`,
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
            className="text-4xl md:text-5xl font-serif text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={
              firstCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t("home.menCollectionTitle")}
          </motion.h2>
          <motion.p
            className="text-lg text-white mb-8"
            initial={{ opacity: 0 }}
            animate={firstCoverInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {t("home.menCollectionSubtitle")}
          </motion.p>
          <motion.button
            className="px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={
              firstCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToMen}
          >
            {t("home.menCollectionButton")}
          </motion.button>
        </motion.div>
      </div>

      {/* Deuxième cover */}
      <div
        ref={secondCoverRef}
        className="w-full h-[500px] relative flex items-center justify-center mb-16"
        style={{
          backgroundImage: `url('${getImageSource(
            "sectioncover2.jpg",
            false
          )}')`,
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
            className="text-4xl md:text-5xl font-serif text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={
              secondCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t("home.womenCollectionTitle")}
          </motion.h2>
          <motion.p
            className="text-lg text-white mb-8"
            initial={{ opacity: 0 }}
            animate={secondCoverInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {t("home.womenCollectionSubtitle")}
          </motion.p>
          <motion.button
            className="px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={
              secondCoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToWomen}
          >
            {t("home.womenCollectionButton")}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default TwoCovers;
