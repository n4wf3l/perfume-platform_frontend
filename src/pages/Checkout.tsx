import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

// Extend the Window interface to include paypal
declare global {
  interface Window {
    paypal?: any;
  }
}

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
    backgroundColor: "#fff", // BLANC FORT
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
    backgroundColor: "#fff", // BLANC FORT
    transition: {
      duration: 0.6,
    },
  },
  filling: {
    backgroundColor: "#fff", // BLANC FORT
    scaleX: [0, 1],
    originX: 0,
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
  const { t } = useTranslation();

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
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(2);
        setIsAnimating(false);
        window.scrollTo(0, 0);
      }, 1300);
      return;
    }

    // Si PayPal est sélectionné, ne rien faire ici
    // L'utilisateur doit cliquer sur le bouton PayPal directement
    if (formData.paymentMethod === "paypal") {
      return;
    }

    // Pour les autres méthodes de paiement, comportement inchangé
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/thank-you");
    }, 2000);
  };

  // Ajoute cette fonction dans ton composant
  const initiatePayPalCheckout = () => {
    setIsProcessing(true);

    // Créer une commande PayPal directement via le SDK
    if (window.paypal) {
      try {
        window.paypal.Buttons.driver("react", { React, ReactDOM });
      } catch (err) {
        console.error("Failed to trigger PayPal manually:", err);

        // Si ça échoue, on essaie la redirection directe
        const paypalURL = `https://www.sandbox.paypal.com/checkoutnow?token=${generateUUID()}`;
        window.open(paypalURL, "_blank");
      }

      setTimeout(() => setIsProcessing(false), 1000);
    } else {
      // Si le SDK PayPal n'est pas disponible, rediriger vers PayPal directement
      window.open("https://www.paypal.com", "_blank");
      setIsProcessing(false);
    }
  };

  // Fonction utilitaire pour générer un UUID pour le token
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  useEffect(() => {
    if (formData.paymentMethod === "paypal" && window.paypal) {
      console.log("Mounting PayPal button...");

      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";

        try {
          window.paypal
            .Buttons({
              // Customise l'apparence
              style: {
                color: "gold",
                shape: "rect",
                label: "pay",
                height: 45,
              },

              // Création de la commande avec les URLs de redirection
              createOrder: (data: Record<string, unknown>, actions: any) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: total.toFixed(2),
                        currency_code: "EUR",
                      },
                    },
                  ],
                  // Spécifie les URLs de redirection ici
                  application_context: {
                    return_url: window.location.origin + "/thank-you", // URL après paiement réussi
                    cancel_url: window.location.origin + "/checkout", // URL si annulation
                    brand_name: "SOGNO D'ORO", // Nom de ta marque
                    user_action: "PAY_NOW", // Encourage l'action immédiate
                    shipping_preference: "NO_SHIPPING", // Si pas besoin d'adresse de livraison supplémentaire
                  },
                });
              },

              // Validation du paiement
              onApprove: (data: Record<string, unknown>, actions: any) => {
                setIsProcessing(true);
                return actions.order.capture().then(function (details: any) {
                  setIsProcessing(false);
                  navigate("/thank-you");
                });
              },

              // Annulation du paiement
              onCancel: () => {
                console.log("Payment cancelled");
              },

              // Erreur
              onError: (err: any) => {
                console.error("PayPal Error:", err);
              },
            })
            .render("#paypal-button-container")
            .then(() => {
              console.log("PayPal button rendered successfully!");
            })
            .catch((err: any) => {
              console.error("PayPal button error:", err);
            });
        } catch (error) {
          console.error("Error creating PayPal button:", error);
        }
      }
    }
  }, [formData.paymentMethod, total, navigate]);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-10"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1
        className="text-3xl font-serif text-white mb-6"
        variants={titleVariants}
      >
        {t("checkout.title")}
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
            className="flex-1 h-1 mx-2 overflow-hidden"
            style={{ position: "relative" }}
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
            {t("checkout.shippingStep")}
          </span>
          <span className="text-sm text-gray-400">
            {t("checkout.paymentStep")}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form section */}
        <motion.div className="lg:col-span-2" variants={fadeIn}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div
                className="bg-black p-6 rounded-lg border border-white/10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h2
                  className="text-xl font-medium text-white mb-4"
                  variants={titleVariants}
                >
                  {t("checkout.shippingTitle")}
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
                      {t("checkout.firstName")}
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
                      {t("checkout.lastName")}
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
                      {t("checkout.email")}
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
                      {t("checkout.phone")}
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
                    {t("checkout.address")}
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
                      {t("checkout.city")}
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
                      {t("checkout.postalCode")}
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
                      {t("checkout.country")}
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
                      <option value="">{t("checkout.selectCountry")}</option>
                      <option value="BE">{t("checkout.countries.BE")}</option>
                      <option value="FR">{t("checkout.countries.FR")}</option>
                      <option value="DE">{t("checkout.countries.DE")}</option>
                      <option value="NL">{t("checkout.countries.NL")}</option>
                      <option value="UK">{t("checkout.countries.UK")}</option>
                    </motion.select>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div
                className="bg-black p-6 rounded-lg border border-white/10"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h2
                  className="text-xl font-medium text-white mb-4"
                  variants={titleVariants}
                >
                  {t("checkout.paymentTitle")}
                </motion.h2>

                <motion.div className="mb-6" variants={staggerContainer}>
                  <p className="text-gray-300 mb-4">
                    {t("checkout.paymentMethod")}
                  </p>

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
                        <span className="ml-2">{t("checkout.creditCard")}</span>
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
                      <span className="ml-2">{t("checkout.paypal")}</span>
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
                      <span className="ml-2">{t("checkout.bankTransfer")}</span>
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
                        {t("checkout.cardNumber")}
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
                          {t("checkout.cardExpiry")}
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
                          {t("checkout.cardCVV")}
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
                    className="mt-4 p-4 border-2 border-yellow-500 rounded-md bg-black"
                    variants={itemVariants}
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
                    <p className="text-yellow-400 mb-4 font-bold">
                      {t("checkout.paypalMessage")}
                    </p>

                    {/* Container pour le SDK PayPal */}
                    <div
                      id="paypal-button-container"
                      className="min-h-[60px]"
                    ></div>

                    {/* Bouton PayPal personnalisé de secours */}
                    <button
                      type="button"
                      className="w-full bg-[#0070ba] hover:bg-[#003087] text-white font-bold py-3 px-4 rounded flex items-center justify-center transition-colors mt-4"
                      onClick={() => initiatePayPalCheckout()}
                      disabled={isProcessing}
                    >
                      <span className="mr-2">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.067 7.301C20.067 9.328 19.043 10.807 17.221 10.807H14.555C14.355 10.807 14.188 10.949 14.155 11.145L13.441 15.849C13.408 16.042 13.242 16.184 13.046 16.184H10.891C10.758 16.184 10.655 16.075 10.666 15.941L10.986 13.715C10.998 13.583 11.103 13.484 11.236 13.484H12.116C14.459 13.484 16.168 11.718 16.168 9.291C16.168 8.079 15.558 7.061 14.528 6.569C15.715 6.569 16.557 6.569 16.557 6.569C18.553 6.569 20.067 7.301 20.067 9.328V7.301ZM7.49 7.301C7.49 9.328 6.466 10.807 4.643 10.807H1.978C1.778 10.807 1.611 10.949 1.578 11.145L0.864 15.849C0.831 16.042 0.665 16.184 0.469 16.184H0.183C0.05 16.184 -0.053 16.075 -0.042 15.941L1.114 7.544C1.147 7.359 1.309 7.226 1.497 7.226H4.643C6.466 7.226 7.49 8.705 7.49 10.731V7.301ZM10.754 7.301C10.754 9.328 9.73 10.807 7.908 10.807H5.242C5.042 10.807 4.875 10.949 4.842 11.145L4.128 15.849C4.095 16.042 3.929 16.184 3.733 16.184H3.447C3.314 16.184 3.211 16.075 3.222 15.941L4.378 7.544C4.411 7.359 4.573 7.226 4.761 7.226H7.908C9.73 7.226 10.754 8.705 10.754 10.731V7.301Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      {isProcessing
                        ? t("checkout.processing")
                        : "PayPal Checkout"}
                    </button>
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
                      {t("checkout.bankInfo")}
                    </p>
                    <motion.div
                      className="text-gray-300 text-sm"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.p variants={itemVariants}>
                        <strong>{t("checkout.iban")}:</strong> BE00 0000 0000
                        0000
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        <strong>{t("checkout.bic")}:</strong> GEBABEBB
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        <strong>{t("checkout.bank")}:</strong> Example Bank
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        <strong>{t("checkout.reference")}:</strong> ORDER-
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
                  {t("checkout.back")}
                </motion.button>
              )}

              <motion.button
                type="submit"
                disabled={isProcessing || isAnimating}
                className={`px-8 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-colors ml-auto flex items-center ${
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
                    ? t("checkout.loading")
                    : t("checkout.continue")
                  : isProcessing
                  ? t("checkout.processing")
                  : t("checkout.order")}
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
            className="bg-black p-6 rounded-lg border border-white/10 sticky top-8"
            whileHover={{
              boxShadow:
                "0 10px 25px -5px rgba(212,175,55,0.1), 0 8px 10px -6px rgba(212,175,55,0.05)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-xl font-medium text-white mb-4"
              variants={titleVariants}
            >
              {t("checkout.summary")}
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
                  <div className="text-white">
                    {(item.price * item.quantity).toFixed(2)}€
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="border-t border-white/10 pt-4 space-y-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="flex justify-between text-gray-400"
                variants={itemVariants}
              >
                <span>{t("checkout.subtotal")}</span>
                <span>{subtotal.toFixed(2)}€</span>
              </motion.div>
              <motion.div
                className="flex justify-between text-gray-400"
                variants={itemVariants}
              >
                <span>{t("checkout.shipping")}</span>
                <span>{shipping.toFixed(2)}€</span>
              </motion.div>
              <motion.div
                className="flex justify-between font-medium text-white border-t border-white/10 pt-2 mt-2"
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
                <span>{t("checkout.total")}</span>
                <motion.span
                  className="text-white"
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
