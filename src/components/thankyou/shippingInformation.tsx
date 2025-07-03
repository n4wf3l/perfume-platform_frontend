import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import type { Variants } from "framer-motion";

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" as const },
  },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeInOut" as const },
  },
};
const recommendedProductsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.6 },
  },
};
const productCardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeInOut" as const },
  },
};

type Product = {
  id: string | number;
  name: string;
  image: string;
  price: number;
};

interface ShippingInformationProps {
  recommendedProducts: Product[];
}

export default function ShippingInformation({
  recommendedProducts,
}: ShippingInformationProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Informations de livraison */}
      <motion.div
        className="bg-black rounded-lg border border-[#d4af37]/10 p-6 mb-12 max-w-3xl mx-auto"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <motion.h2
          className="text-xl font-medium text-[#d4af37] mb-4"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {t("thankYou.shippingInfo")}
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: 0.8, duration: 0.6 },
            }}
          >
            <h3 className="text-gray-300 font-medium mb-2">
              {t("thankYou.estimatedDelivery")}
            </h3>
            <p className="text-gray-400">
              {t("thankYou.estimatedDeliveryValue")}
            </p>
          </motion.div>
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: 1, duration: 0.6 },
            }}
          >
            <h3 className="text-gray-300 font-medium mb-2">
              {t("thankYou.tracking")}
            </h3>
            <p className="text-gray-400">{t("thankYou.trackingValue")}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Produits recommandés */}
      <motion.div
        className="pt-8 border-t border-[#d4af37]/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.h2
          className="text-2xl font-serif text-[#d4af37] text-center mb-8"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.3 }}
        >
          {t("thankYou.recommendations")}
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          variants={recommendedProductsVariants}
          initial="hidden"
          animate="visible"
        >
          {recommendedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={productCardVariants}
              custom={index}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/product/${product.id}`} className="group block">
                <div className="bg-black rounded-lg overflow-hidden border border-[#d4af37]/10 hover:border-[#d4af37]/30 transition-all duration-300">
                  <div className="h-64 overflow-hidden">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-200 group-hover:text-[#d4af37] transition-colors mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[#d4af37]">
                      {product.price.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Informations de support */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <motion.h2
          className="text-xl font-medium text-gray-200 mb-2"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {t("thankYou.questions")}
        </motion.h2>
        <motion.p className="text-gray-400 mb-4" variants={titleVariants}>
          {t("thankYou.contactSupport")}
        </motion.p>
        <div className="flex justify-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="text-[#d4af37] hover:text-[#c5a028] transition-colors"
            >
              {t("thankYou.contactUs")}
            </Link>
          </motion.div>
          <span className="text-gray-600">|</span>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href="mailto:info@sognodoro.com"
              className="text-[#d4af37] hover:text-[#c5a028] transition-colors"
            >
              info@sognodoro.com
            </a>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
