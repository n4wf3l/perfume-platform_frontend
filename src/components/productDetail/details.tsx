import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import
import type { Product } from "../../types/api";

interface DetailsProps {
  product: Product;
  onAddToCart: () => void;
  onPayPalClick: (e: React.MouseEvent) => void;
}

const Details: React.FC<DetailsProps> = ({
  product,
  onAddToCart,
  onPayPalClick,
}) => {
  const { t } = useTranslation(); // Ajout hook
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Format gender for display
  const formatGender = (gender: string | undefined) => {
    if (!gender) return "Unisexe";

    const genders: { [key: string]: string } = {
      male: "Homme",
      female: "Femme",
      unisex: "Unisexe",
    };

    return (
      genders[gender.toLowerCase()] ||
      gender.charAt(0).toUpperCase() + gender.slice(1)
    );
  };

  const getStockStatus = (stock: number | undefined) => {
    if (!stock || stock === 0) {
      return { text: "Rupture de stock", color: "text-red-400" };
    } else if (stock <= 2) {
      return { text: "Stock Limité", color: "text-yellow-400" };
    } else {
      return { text: "Disponible", color: "text-green-400" };
    }
  };

  return (
    <motion.div
      className="lg:w-1/2 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Bloc principal style "carré" */}
      <div className=" border border-white/20 rounded-xl p-8 shadow-lg w-full max-w-xl mx-auto">
        <h1 className="text-4xl font-serif text-white mb-2">{product.name}</h1>
        <div className="uppercase text-xs tracking-widest text-gray-300 mb-4">
          {t("product.extrait")}
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">{t("product.size")}</span>
            <span className="text-base text-white font-medium">
              {product.size_ml + " ml" || "N/A"}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">
              {t("product.category")}
            </span>
            <span className="text-base text-white font-medium">
              {product.category?.name || "N/A"}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">{t("product.gender")}</span>
            <span className="text-base text-white font-medium">
              {product.gender?.toLowerCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 text-sm">{t("product.price")}</span>
          <span className="text-2xl text-white font-semibold">
            {typeof product.price === "number"
              ? product.price.toFixed(2)
              : "0.00"}{" "}
            €
          </span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-400 text-sm">Stock</span>
          {(() => {
            const { text, color } = getStockStatus(product.stock);
            return (
              <span className={`px-2 py-1 ${color} rounded-md text-xs`}>
                {text}
              </span>
            );
          })()}
        </div>
        <div className="flex flex-col gap-3">
          <motion.button
            className="w-full px-6 py-3 bg-white hover:bg-white/90 text-black font-medium rounded-md transition-colors duration-300"
            onClick={onAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("product.addToCart")}
          </motion.button>
          <motion.button
            className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-md transition-colors duration-300"
            onClick={() => setShowPaymentOptions(!showPaymentOptions)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showPaymentOptions
              ? t("product.hideOptions")
              : t("product.buyNow")}
          </motion.button>
        </div>
        {/* Options de paiement */}
        {showPaymentOptions && (
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.a
              href="#"
              onClick={onPayPalClick}
              className="transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/paypall.png" alt="PayPal" className="h-10" />
            </motion.a>
            <motion.a
              href="https://wa.me/32465263138"
              target="_blank"
              rel="noreferrer"
              className="transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-10 w-10 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
              </svg>
            </motion.a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Details;
