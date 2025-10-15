import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Product } from "../../types/api";

interface CartItem {
  product: Product;
  quantity: number;
}

interface SummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string;
  setPromoCode: React.Dispatch<React.SetStateAction<string>>;
  promoError: string;
  promoSuccess: string;
  handlePromoCode: (e: React.FormEvent) => void;
  cartItems: CartItem[]; // Ajouter les items du panier
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.58, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0, 0, 0.58, 1],
    },
  }),
};

const Summary: React.FC<SummaryProps> = ({
  subtotal,
  shipping,
  discount,
  total,
  promoCode,
  setPromoCode,
  promoError,
  promoSuccess,
  handlePromoCode,
  cartItems, // Ajouter cartItems
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCheckout = () => {
    // Numéro WhatsApp de Sogno Doro
    const phoneNumber = "32465263138";
    
    // Construire la liste des produits
    const productsList = cartItems.map(item => 
      `- ${item.product.name} (${item.product.size_ml ? item.product.size_ml + 'ml' : ''}) x${item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}€`
    ).join('\n');
    
    // Message pré-rempli pour la commande
    const message = encodeURIComponent(
      `Bonjour Sogno Doro ! Je souhaite procéder au paiement de ma commande.\n\n` +
      `Produits commandés:\n${productsList}\n\n` +
      `Sous-total: ${subtotal.toFixed(2)}€\n` +
      `Livraison: ${shipping.toFixed(2)}€\n` +
      `Remise: ${discount.toFixed(2)}€\n` +
      `Total: ${total.toFixed(2)}€\n\n` +
      `Pouvez-vous m'aider avec le processus de paiement ?`
    );
    
    // Ouvrir WhatsApp avec le message pré-rempli
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Ancienne fonction commentée pour référence
  // const handleCheckout = () => {
  //   navigate("/checkout");
  // };

  return (
    <motion.div
      className="lg:w-4/12"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-serif text-white mb-4">
          {t("checkout.summary")}
        </h2>

        <div className="space-y-3 text-gray-300">
          <motion.div
            className="flex justify-between"
            custom={0}
            variants={itemVariants}
          >
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)}€</span>
          </motion.div>
          <motion.div
            className="flex justify-between"
            custom={1}
            variants={itemVariants}
          >
            <div className="flex flex-col">
              <span>Livraison</span>
              <span className="text-xs text-gray-400">
                {shipping === 0 ? t("checkout.brusselsFreeShipping") : t("checkout.shippingOutsideBrussels")}
              </span>
            </div>
            <span>{(0).toFixed(2)}€</span>
          </motion.div>
          {discount > 0 && (
            <motion.div
              className="flex justify-between text-green-500"
              custom={2}
              variants={itemVariants}
            >
              <span>Réduction</span>
              <span>-{discount.toFixed(2)}€</span>
            </motion.div>
          )}
          <motion.div
            className="border-t border-white/20 pt-3 flex justify-between font-medium text-lg"
            custom={3}
            variants={itemVariants}
          >
            <span>Total</span>
            <span className="text-white">{total.toFixed(2)}€</span>
          </motion.div>
        </div>

        <motion.button
          onClick={handleCheckout}
          className="mt-6 w-full px-6 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-colors duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Procéder au paiement
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Summary;
