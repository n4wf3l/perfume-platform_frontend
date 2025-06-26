import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Summary from "../components/cart/summary";
import BottomCover from "../components/cart/bottomCover";

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Sogno Intenso",
    price: 149.99,
    image: "/perfum1.jpg",
    quantity: 1,
    size: "100ml",
  },
  {
    id: 3,
    name: "Notte Stellata",
    price: 139.99,
    image: "/perfum2.jpg",
    quantity: 1,
    size: "50ml",
  },
];

// Variants avec typage correct pour les animations
const titleVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1], // easeOut en valeurs cubiques au lieu de string
    },
  },
};

const cartItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0, 0, 0.58, 1], // easeOut en valeurs cubiques
    },
  }),
};

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const discount = promoSuccess ? subtotal * 0.1 : 0; // 10% discount if promo applied
  const total = subtotal + shipping - discount;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handlePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoSuccess("10% de réduction appliquée");
      setPromoError("");
    } else {
      setPromoError("Code promo invalide");
      setPromoSuccess("");
    }
  };

  return (
    <>
      <div className="pt-12 px-4 sm:px-6 lg:px-8 pb-0">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl font-serif text-[#d4af37] text-center mb-12"
          >
            Votre Panier
          </motion.h1>

          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="border border-[#d4af37]/20 rounded-lg p-8 text-center mb-8"
            >
              <h2 className="text-2xl font-serif text-[#d4af37] mb-4">
                Votre panier est vide
              </h2>
              <p className="text-gray-300 mb-6">
                Découvrez notre collection de parfums exclusifs
              </p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/shop"
                  className="inline-block px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-black font-medium rounded-md transition-colors duration-300"
                >
                  Continuer mes achats
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              {/* Cart Items */}
              <div className="lg:w-8/12">
                <motion.div
                  className="border border-[#d4af37]/10 rounded-lg overflow-hidden mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#d4af37]/20 text-gray-400 text-left">
                        <th className="px-4 py-3">Produit</th>
                        <th className="px-4 py-3">Prix</th>
                        <th className="px-4 py-3">Quantité</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3 sr-only">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4af37]/10">
                      {cartItems.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          className="text-gray-300"
                          custom={index}
                          variants={cartItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md mr-4"
                              />
                              <div>
                                <h3 className="font-medium text-[#d4af37]">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {item.size}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {item.price.toFixed(2)}€
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center border border-[#d4af37]/30 rounded-md max-w-[100px]">
                              <motion.button
                                whileHover={{
                                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                                }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="px-2 py-1 text-gray-400 hover:text-[#d4af37] focus:outline-none rounded-l-md"
                              >
                                -
                              </motion.button>
                              <span className="px-2 py-1">{item.quantity}</span>
                              <motion.button
                                whileHover={{
                                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                                }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-2 py-1 text-gray-400 hover:text-[#d4af37] focus:outline-none rounded-r-md"
                              >
                                +
                              </motion.button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {(item.price * item.quantity).toFixed(2)}€
                          </td>
                          <td className="px-4 py-4">
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#d4af37" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-[#d4af37] focus:outline-none"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>

                <motion.div
                  className="flex justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/shop"
                      className="inline-flex items-center px-4 py-2 border border-[#d4af37]/30 rounded-md text-gray-300 hover:bg-black/40 transition-colors duration-300"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Continuer mes achats
                    </Link>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCartItems([])}
                    className="inline-flex items-center px-4 py-2 border border-[#d4af37]/30 rounded-md text-gray-300 hover:bg-black/40 transition-colors duration-300"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Vider mon panier
                  </motion.button>
                </motion.div>
              </div>

              {/* Summary Component */}
              <Summary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                promoError={promoError}
                promoSuccess={promoSuccess}
                handlePromoCode={handlePromoCode}
              />
            </div>
          )}
        </div>
      </div>
      <BottomCover />
    </>
  );
};

export default Cart;
