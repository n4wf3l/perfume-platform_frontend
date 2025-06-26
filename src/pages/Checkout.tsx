import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Ajout d'AnimatePresence
import type { Variants } from "framer-motion";

// Mock cart data for summary
const cartItems = [
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

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
};

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
};

const stepVariants: Variants = {
  inactive: {
    backgroundColor: "#000",
    color: "#9ca3af",
    scale: 0.95,
    transition: {
      duration: 0.3,
    },
  },
  active: {
    backgroundColor: "#d4af37",
    color: "#000",
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const lineVariants: Variants = {
  inactive: {
    backgroundColor: "#374151",
    transition: {
      duration: 0.4,
    },
  },
  active: {
    backgroundColor: "#d4af37",
    transition: {
      duration: 0.6,
    },
  },
  // Ajouter un état pour l'animation de progression
  filling: {
    backgroundColor: "#d4af37",
    scaleX: [0, 1],
    originX: 0, // Pour que l'animation commence de la gauche
    transition: {
      duration: 1.2,
      ease: [0.4, 0, 0.2, 1], // ease-out
    },
  },
};

const buttonVariants: Variants = {
  idle: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
  disabled: { opacity: 0.7 },
};

const summarySectionVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0, 0, 0.58, 1], // easeOut
    },
  },
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const total = subtotal + shipping;

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "credit-card",
  });

  // État pour suivre l'animation de la barre de progression
  const [isAnimating, setIsAnimating] = useState(false);

  // Payment steps
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      // Déclencher l'animation de la barre de progression
      setIsAnimating(true);

      // Après la durée de l'animation, passer à l'étape suivante
      setTimeout(() => {
        setCurrentStep(2);
        setIsAnimating(false);
        window.scrollTo(0, 0);
      }, 1300); // Un peu plus que la durée de l'animation (1.2s) pour être sûr

      return;
    }

    // Traitement du paiement (étape finale)
    setIsProcessing(true);

    // Simulation du traitement du paiement
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/thank-you");
    }, 2000);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-10"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1
        className="text-3xl font-serif text-[#d4af37] mb-6"
        variants={titleVariants}
      >
        Paiement
      </motion.h1>

      {/* Progress indicator */}
      <motion.div className="mb-10" variants={fadeIn}>
        <div className="flex items-center">
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-700"
            variants={stepVariants}
            animate={currentStep >= 1 ? "active" : "inactive"}
          >
            1
          </motion.div>
          <motion.div
            className="flex-1 h-1 mx-2 overflow-hidden" // Ajout de overflow-hidden pour contenir l'animation
            style={{ position: "relative" }} // Pour positionner correctement la barre animée
          >
            <motion.div
              className="h-full w-full absolute"
              variants={lineVariants}
              animate={
                isAnimating
                  ? "filling"
                  : currentStep >= 2
                  ? "active"
                  : "inactive"
              }
            />
          </motion.div>
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-700"
            variants={stepVariants}
            animate={currentStep >= 2 ? "active" : "inactive"}
          >
            2
          </motion.div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-400">
            Informations de livraison
          </span>
          <span className="text-sm text-gray-400">Paiement</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form section */}
        <motion.div className="lg:col-span-2" variants={fadeIn}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                className="bg-black p-6 rounded-lg border border-[#d4af37]/10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h2
                  className="text-xl font-medium text-[#d4af37] mb-4"
                  variants={titleVariants}
                >
                  Informations de livraison
                </motion.h2>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                  variants={staggerContainer}
                >
                  <motion.div variants={itemVariants}>
                    <label
                      className="block text-gray-400 text-sm mb-2"
                      htmlFor="firstName"
                    >
                      Prénom*
                    </label>
                    <motion.input
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className="block text-gray-400 text-sm mb-2"
                      htmlFor="lastName"
                    >
                      Nom*
                    </label>
                    <motion.input
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                  variants={staggerContainer}
                >
                  <motion.div variants={itemVariants}>
                    <label
                      className="block text-gray-400 text-sm mb-2"
                      htmlFor="email"
                    >
                      Email*
                    </label>
                    <motion.input
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className="block text-gray-400 text-sm mb-2"
                      htmlFor="phone"
                    >
                      Téléphone
                    </label>
                    <motion.input
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                </motion.div>

                <motion.div className="mb-6" variants={itemVariants}>
                  <label
                    className="block text-gray-400 text-sm mb-2"
                    htmlFor="address"
                  >
                    Adresse*
                  </label>
                  <motion.input
                    whileFocus={{
                      borderColor: "#d4af37",
                      boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                    }}
                    className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                  variants={staggerContainer}
                >
                  <motion.div variants={itemVariants}>
                    <label
                      className="block text-gray-400 text-sm mb-2"
                      htmlFor="city"
                    >
                      Ville*
                    </label>
                    <motion.input
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className="block text-gray-400 text-sm mb-2"
                      htmlFor="postalCode"
                    >
                      Code Postal*
                    </label>
                    <motion.input
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label
                      className="block text-gray-400 text-sm mb-2"
                      htmlFor="country"
                    >
                      Pays*
                    </label>
                    <motion.select
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez un pays</option>
                      <option value="BE">Belgique</option>
                      <option value="FR">France</option>
                      <option value="DE">Allemagne</option>
                      <option value="NL">Pays-Bas</option>
                      <option value="UK">Royaume-Uni</option>
                    </motion.select>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div
                className="bg-black p-6 rounded-lg border border-[#d4af37]/10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h2
                  className="text-xl font-medium text-[#d4af37] mb-4"
                  variants={titleVariants}
                >
                  Paiement
                </motion.h2>

                <motion.div className="mb-6" variants={staggerContainer}>
                  <p className="text-gray-300 mb-4">Méthode de paiement</p>

                  <div className="flex flex-col space-y-3">
                    <motion.label
                      className="flex items-center space-x-3 p-3 border border-[#d4af37]/30 rounded-md bg-black"
                      variants={itemVariants}
                      whileHover={{
                        backgroundColor: "rgba(212, 175, 55, 0.05)",
                        borderColor: "rgba(212, 175, 55, 0.5)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === "credit-card"}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#d4af37]"
                      />
                      <div className="flex items-center">
                        <span className="ml-2">Carte de crédit</span>
                        <div className="flex space-x-2 ml-4">
                          <motion.div
                            className="w-8 h-5 bg-blue-700 rounded"
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.2 },
                            }}
                          ></motion.div>
                          <motion.div
                            className="w-8 h-5 bg-red-600 rounded"
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.2 },
                            }}
                          ></motion.div>
                          <motion.div
                            className="w-8 h-5 bg-green-600 rounded"
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.2 },
                            }}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.label>

                    <motion.label
                      className="flex items-center space-x-3 p-3 border border-[#d4af37]/30 rounded-md bg-black"
                      variants={itemVariants}
                      whileHover={{
                        backgroundColor: "rgba(212, 175, 55, 0.05)",
                        borderColor: "rgba(212, 175, 55, 0.5)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === "paypal"}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#d4af37]"
                      />
                      <span className="ml-2">PayPal</span>
                    </motion.label>

                    <motion.label
                      className="flex items-center space-x-3 p-3 border border-[#d4af37]/30 rounded-md bg-black"
                      variants={itemVariants}
                      whileHover={{
                        backgroundColor: "rgba(212, 175, 55, 0.05)",
                        borderColor: "rgba(212, 175, 55, 0.5)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank-transfer"
                        checked={formData.paymentMethod === "bank-transfer"}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-[#d4af37]"
                      />
                      <span className="ml-2">Virement bancaire</span>
                    </motion.label>
                  </div>
                </motion.div>

                {/* Credit card form conditionally rendered */}
                {formData.paymentMethod === "credit-card" && (
                  <motion.div
                    className="grid grid-cols-1 gap-4 mb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        opacity: { duration: 0.3, delay: 0.2 },
                        height: { duration: 0.3 },
                      },
                    }}
                  >
                    <motion.div variants={itemVariants}>
                      <label className="block text-gray-400 text-sm mb-2">
                        Numéro de carte
                      </label>
                      <motion.input
                        whileFocus={{
                          borderColor: "#d4af37",
                          boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                        }}
                        className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div variants={itemVariants}>
                        <label className="block text-gray-400 text-sm mb-2">
                          Date d'expiration
                        </label>
                        <motion.input
                          whileFocus={{
                            borderColor: "#d4af37",
                            boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                          }}
                          className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                          type="text"
                          placeholder="MM/AA"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label className="block text-gray-400 text-sm mb-2">
                          CVV
                        </label>
                        <motion.input
                          whileFocus={{
                            borderColor: "#d4af37",
                            boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                          }}
                          className="w-full bg-black border border-[#d4af37]/30 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                          type="text"
                          placeholder="123"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* PayPal instructions */}
                {formData.paymentMethod === "paypal" && (
                  <motion.div
                    className="bg-black border border-[#d4af37]/10 p-4 rounded-md mb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        opacity: { duration: 0.3, delay: 0.2 },
                        height: { duration: 0.3 },
                      },
                    }}
                  >
                    <p className="text-gray-300 text-sm">
                      Vous serez redirigé vers PayPal pour compléter votre
                      paiement après avoir validé votre commande.
                    </p>
                  </motion.div>
                )}

                {/* Bank transfer instructions */}
                {formData.paymentMethod === "bank-transfer" && (
                  <motion.div
                    className="bg-black border border-[#d4af37]/10 p-4 rounded-md mb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        opacity: { duration: 0.3, delay: 0.2 },
                        height: { duration: 0.3 },
                      },
                    }}
                  >
                    <p className="text-gray-300 text-sm mb-4">
                      Veuillez effectuer un virement sur notre compte bancaire
                      avec les informations suivantes. Votre commande sera
                      traitée après réception du paiement.
                    </p>
                    <motion.div
                      className="text-gray-300 text-sm"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.p variants={itemVariants}>
                        <strong>IBAN:</strong> BE00 0000 0000 0000
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        <strong>BIC:</strong> GEBABEBB
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        <strong>Banque:</strong> Example Bank
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        <strong>Référence:</strong> ORDER-
                        {Math.floor(Math.random() * 1000000)}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Navigation buttons */}
            <motion.div
              className="mt-8 flex justify-between"
              variants={fadeIn}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-black border border-[#d4af37]/20 text-gray-300 hover:bg-black/40 rounded-md transition-colors"
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  disabled={isProcessing}
                >
                  Retour
                </motion.button>
              )}

              <motion.button
                type="submit"
                disabled={isProcessing || isAnimating}
                className={`px-8 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-black font-medium rounded-md transition-colors ml-auto flex items-center ${
                  isProcessing || isAnimating
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
                variants={buttonVariants}
                initial="idle"
                whileHover={isProcessing || isAnimating ? "disabled" : "hover"}
                whileTap={isProcessing || isAnimating ? "disabled" : "tap"}
                animate={isProcessing || isAnimating ? "disabled" : "idle"}
              >
                {isProcessing && (
                  <motion.svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </motion.svg>
                )}

                {isAnimating && (
                  <motion.svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </motion.svg>
                )}

                {currentStep === 1
                  ? isAnimating
                    ? "Chargement..."
                    : "Continuer"
                  : isProcessing
                  ? "Traitement en cours..."
                  : "Commander"}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Order summary section */}
        <motion.div
          className="lg:col-span-1"
          variants={summarySectionVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-black p-6 rounded-lg border border-[#d4af37]/10 sticky top-8"
            whileHover={{
              boxShadow:
                "0 10px 25px -5px rgba(212,175,55,0.1), 0 8px 10px -6px rgba(212,175,55,0.05)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-xl font-medium text-[#d4af37] mb-4"
              variants={titleVariants}
            >
              Récapitulatif
            </motion.h2>

            <motion.div className="space-y-4 mb-6" variants={staggerContainer}>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                  custom={index}
                  whileHover={{
                    backgroundColor: "rgba(212, 175, 55, 0.05)",
                    borderRadius: "0.375rem",
                  }}
                >
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-200 font-medium">{item.name}</h3>
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

            <motion.div
              className="border-t border-[#d4af37]/10 pt-4 space-y-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="flex justify-between text-gray-400"
                variants={itemVariants}
              >
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </motion.div>
              <motion.div
                className="flex justify-between text-gray-400"
                variants={itemVariants}
              >
                <span>Livraison</span>
                <span>{shipping.toFixed(2)}€</span>
              </motion.div>
              <motion.div
                className="flex justify-between font-medium text-gray-200 border-t border-[#d4af37]/10 pt-2 mt-2"
                variants={itemVariants}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.5,
                    duration: 0.4,
                  },
                }}
              >
                <span>Total</span>
                <motion.span
                  className="text-[#d4af37]"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 1.2,
                      times: [0, 0.5, 1],
                      delay: 1,
                    },
                  }}
                >
                  {total.toFixed(2)}€
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Checkout;
