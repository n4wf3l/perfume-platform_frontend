import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const handleBuyNow = () => {
    // Numéro WhatsApp de Sogno Doro
    const phoneNumber = "32465263138";

    // Message pré-rempli pour la commande du produit
    const message = encodeURIComponent(
      `Bonjour Sogno D'Oro ! Je souhaite commander ce produit :\n\n` +
      `Produit: ${product.name}\n` +
      `Taille: ${product.size_ml ? product.size_ml + 'ml' : 'N/A'}\n` +
      `Prix: ${typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}€\n\n` +
      `Pouvez-vous m'aider avec le processus de paiement ?`
    );

    // Ouvrir WhatsApp avec le message pré-rempli
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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
      <div className="border border-white/20 rounded-xl p-8 shadow-lg w-full max-w-xl mx-auto">
        <h1 className="text-4xl font-serif text-white mb-2">{product.name}</h1>
        <div className="uppercase text-xs tracking-widest text-gray-300 mb-4">
          {t("product.extrait")}
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400">{t("product.size")}</span>
            <span className="text-base text-white font-medium">
              {product.size_ml ? product.size_ml + " ml" : "N/A"}
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
              {product.gender || "N/A"}
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
            onClick={handleBuyNow}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("product.buyNow")}
          </motion.button>
        </div>
        {/* Information livraison gratuite Bruxelles */}
        <div className="mt-4 px-3 py-2 bg-white/10 rounded-md">
          <div className="flex items-center text-sm text-white">
            <svg
              className="w-5 h-5 mr-2 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{t("product.freeDelivery")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Details;
