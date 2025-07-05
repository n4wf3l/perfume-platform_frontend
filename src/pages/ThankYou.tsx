import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next";

import DisplayMessage from "../components/thankyou/displayMessage";
import OrderDetails from "../components/thankyou/orderDetails";
import ShippingInformation from "../components/thankyou/shippingInformation";

// Mock order data
const order = {
  id: "ORD-12345",
  date: new Date().toLocaleDateString(),
  total: 299.98,
  items: [
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
  ],
  shipping: 10.0,
};

// Mock recommended products
const recommendedProducts = [
  {
    id: 2,
    name: "Luna Dorata",
    price: 129.99,
    image: "/perfum3.jpg",
  },
  {
    id: 4,
    name: "Velluto Nero",
    price: 159.99,
    image: "/perfum1.jpg",
  },
  {
    id: 5,
    name: "Alba Ambrata",
    price: 134.99,
    image: "/perfum2.jpg",
  },
];

// Animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const successIconVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.2,
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
};

const orderItemsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const orderItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
};

const recommendedProductsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.6,
    },
  },
};

const productCardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
};

const ThankYou: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <DisplayMessage />
      <OrderDetails order={order} />
      <ShippingInformation recommendedProducts={recommendedProducts} />
    </div>
  );
};

export default ThankYou;
