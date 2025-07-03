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
const orderItemsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};
const orderItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeInOut" as const },
  },
};

interface OrderItem {
  id: string | number;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string | number;
  date: string;
  items: OrderItem[];
  total: number;
  shipping: number;
}

export default function OrderDetails({ order }: { order: Order }) {
  const { t } = useTranslation();
  return (
    <motion.div
      className="bg-black rounded-lg border border-[#d4af37]/10 p-6 mb-12 max-w-3xl mx-auto"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <motion.h2
            className="text-xl font-medium text-[#d4af37] mb-1"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {t("thankYou.orderDetails")}
          </motion.h2>
          <motion.p
            className="text-gray-400 text-sm"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {t("thankYou.orderNumber")}:{" "}
            <span className="text-gray-300">{order.id}</span>
          </motion.p>
          <motion.p
            className="text-gray-400 text-sm"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            {t("thankYou.orderDate")}:{" "}
            <span className="text-gray-300">{order.date}</span>
          </motion.p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/shop"
            className="bg-[#d4af37] hover:bg-[#c5a028] text-black font-medium px-6 py-3 rounded-md self-start transition-colors inline-block"
          >
            {t("thankYou.continueShopping")}
          </Link>
        </motion.div>
      </div>

      {/* Articles commandés */}
      <motion.div className="border-t border-[#d4af37]/10 pt-6 mb-6">
        <motion.h3
          className="text-lg font-medium text-gray-200 mb-4"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          {t("thankYou.orderedItems")}
        </motion.h3>
        <motion.div
          className="space-y-4"
          variants={orderItemsContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {order.items.map((item) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-4"
              variants={orderItemVariants}
            >
              <motion.img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <div className="flex-1">
                <h4 className="text-gray-200 font-medium">{item.name}</h4>
                <p className="text-sm text-gray-400">
                  {item.size} × {item.quantity}
                </p>
              </div>
              <div className="text-[#d4af37]">
                {(item.price * item.quantity).toFixed(2)}€
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Récapitulatif de la commande */}
      <motion.div
        className="border-t border-[#d4af37]/10 pt-4 space-y-2"
        variants={orderItemsContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex justify-between text-gray-400"
          variants={orderItemVariants}
        >
          <span>{t("thankYou.subtotal")}</span>
          <span>{(order.total - order.shipping).toFixed(2)}€</span>
        </motion.div>
        <motion.div
          className="flex justify-between text-gray-400"
          variants={orderItemVariants}
        >
          <span>{t("thankYou.shipping")}</span>
          <span>{order.shipping.toFixed(2)}€</span>
        </motion.div>
        <motion.div
          className="flex justify-between font-medium text-gray-200 border-t border-[#d4af37]/10 pt-2 mt-2"
          variants={orderItemVariants}
        >
          <span>{t("thankYou.total")}</span>
          <motion.span
            className="text-[#d4af37]"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.05, 1],
              transition: { duration: 0.8, times: [0, 0.5, 1], delay: 1.5 },
            }}
          >
            {order.total.toFixed(2)}€
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
