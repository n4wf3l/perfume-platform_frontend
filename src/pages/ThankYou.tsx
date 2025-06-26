import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

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
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-16"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Message de succès */}
      <motion.div className="text-center mb-12">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 mb-6"
          variants={successIconVariants}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <motion.h1
          className="text-4xl font-serif text-[#d4af37] mb-4"
          variants={titleVariants}
        >
          Merci pour votre commande
        </motion.h1>
        <motion.p
          className="text-gray-300 text-lg max-w-2xl mx-auto"
          variants={titleVariants}
          transition={{ delay: 0.2 }}
        >
          Votre commande a été reçue et est en cours de traitement. Vous
          recevrez un email de confirmation sous peu.
        </motion.p>
      </motion.div>

      {/* Détails de la commande */}
      <motion.div
        className="bg-black rounded-lg border border-[#d4af37]/10 p-6 mb-12 max-w-3xl mx-auto"
        variants={cardVariants}
      >
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <motion.h2
              className="text-xl font-medium text-[#d4af37] mb-1"
              variants={titleVariants}
            >
              Détails de la commande
            </motion.h2>
            <motion.p
              className="text-gray-400 text-sm"
              variants={titleVariants}
              custom={1}
            >
              Numéro de commande:{" "}
              <span className="text-gray-300">{order.id}</span>
            </motion.p>
            <motion.p
              className="text-gray-400 text-sm"
              variants={titleVariants}
              custom={2}
            >
              Date de commande:{" "}
              <span className="text-gray-300">{order.date}</span>
            </motion.p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/shop"
              className="bg-[#d4af37] hover:bg-[#c5a028] text-black font-medium px-6 py-3 rounded-md self-start transition-colors inline-block"
            >
              Continuer mes achats
            </Link>
          </motion.div>
        </div>

        {/* Articles commandés */}
        <motion.div className="border-t border-[#d4af37]/10 pt-6 mb-6">
          <motion.h3
            className="text-lg font-medium text-gray-200 mb-4"
            variants={titleVariants}
          >
            Articles commandés
          </motion.h3>
          <motion.div
            className="space-y-4"
            variants={orderItemsContainerVariants}
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
        >
          <motion.div
            className="flex justify-between text-gray-400"
            variants={orderItemVariants}
          >
            <span>Sous-total</span>
            <span>{(order.total - order.shipping).toFixed(2)}€</span>
          </motion.div>
          <motion.div
            className="flex justify-between text-gray-400"
            variants={orderItemVariants}
          >
            <span>Livraison</span>
            <span>{order.shipping.toFixed(2)}€</span>
          </motion.div>
          <motion.div
            className="flex justify-between font-medium text-gray-200 border-t border-[#d4af37]/10 pt-2 mt-2"
            variants={orderItemVariants}
          >
            <span>Total</span>
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

      {/* Informations de livraison */}
      <motion.div
        className="bg-black rounded-lg border border-[#d4af37]/10 p-6 mb-12 max-w-3xl mx-auto"
        variants={cardVariants}
        transition={{ delay: 0.2 }}
      >
        <motion.h2
          className="text-xl font-medium text-[#d4af37] mb-4"
          variants={titleVariants}
        >
          Informations de livraison
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
              Délai de livraison estimé
            </h3>
            <p className="text-gray-400">3-5 jours ouvrables</p>
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
              Suivi de commande
            </h3>
            <p className="text-gray-400">
              Un email avec les informations de suivi vous sera envoyé.
            </p>
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
          Vous pourriez également aimer
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
        >
          Des questions ?
        </motion.h2>
        <motion.p className="text-gray-400 mb-4" variants={titleVariants}>
          Contactez notre équipe de support
        </motion.p>
        <div className="flex justify-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="text-[#d4af37] hover:text-[#c5a028] transition-colors"
            >
              Nous contacter
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
    </motion.div>
  );
};

export default ThankYou;
