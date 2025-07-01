import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
}

interface SeeAlsoProps {
  relatedProducts?: Product[];
}

const SeeAlso: React.FC<SeeAlsoProps> = ({ relatedProducts = [] }) => {
  const { t } = useTranslation(); // Ajout hook

  return (
    <motion.div
      className="mt-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <h2 className="text-2xl font-serif text-white mb-6 text-center">
        {t("product.seeAlso")}
      </h2>
      <div className="w-24 h-0.5 bg-white mx-auto mb-10"></div>

      {relatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-gray-900 rounded-lg overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-white mb-1">
                  {product.name}
                </h3>
                <p className="text-white mb-2">{product.price.toFixed(2)} €</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">{t("product.noRelated")}</p>
      )}
    </motion.div>
  );
};

export default SeeAlso;
