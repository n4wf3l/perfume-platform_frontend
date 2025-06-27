import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

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
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="lg:w-4/12"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-serif text-white mb-4">Récapitulatif</h2>

        <div className="mb-6">
          <form onSubmit={handlePromoCode}>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Code promo
            </label>
            <div className="flex">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="bg-black border border-white/30 rounded-l-md px-4 py-2 flex-grow text-gray-300 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                placeholder="Entrez votre code promo"
              />
              <motion.button
                type="submit"
                className="px-4 py-2 bg-black border border-white/30 border-l-0 rounded-r-md text-white hover:bg-black/40"
                whileHover={{ backgroundColor: "rgba(30, 30, 30, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Appliquer
              </motion.button>
            </div>
            {promoError && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {promoError}
              </motion.p>
            )}
            {promoSuccess && (
              <motion.p
                className="text-green-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {promoSuccess}
              </motion.p>
            )}
          </form>
        </div>

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
            <span>Livraison</span>
            <span>{shipping.toFixed(2)}€</span>
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
          onClick={() => navigate("/checkout")}
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
