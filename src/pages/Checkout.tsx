import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useCart } from "../context/CartContext";

// Extend the Window interface to include paypal
declare global {
  interface Window {
    paypal?: any;
  }
}

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

// Brussels postal code ranges
const isBrusselsPostalCode = (code: string): boolean => {
  // Brussels postal codes are between 1000-1210
  const postalCode = parseInt(code, 10);
  return !isNaN(postalCode) && postalCode >= 1000 && postalCode <= 1210;
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { items: cartItems } = useCart();

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
    paymentMethod: "paypal", // Default to PayPal now
  });

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Check if shipping is free (Brussels region)
  const shouldHaveFreeShipping = isBrusselsPostalCode(formData.postalCode);
  const shipping = subtotal > 0 ? (shouldHaveFreeShipping ? 0 : 10) : 0;
  const total = subtotal + shipping;

  // État pour l'animation et la progression

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

    // Update shipping cost dynamically when postal code changes
    if (name === "postalCode") {
      // The shipping cost will be recalculated when formData updates
      // due to the way React works with state updates
      console.log(
        `Postal code changed: ${value} - Brussels region: ${isBrusselsPostalCode(
          value
        )}`
      );
    }
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

    // Uniquement pour le paiement par virement bancaire
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
    // Ne rien faire si nous ne sommes pas à l'étape de paiement
    if (currentStep !== 2) return;
    
    // Petit délai pour s'assurer que le DOM est prêt
    const timeoutId = setTimeout(() => {
      // Vérifier si le script PayPal est déjà chargé
      if (!window.paypal) {
        // Créer et ajouter le script PayPal
        const script = document.createElement("script");
        // Remplacer par un vrai client ID (sandbox pour les tests)
        script.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=EUR";
        script.async = true;

        script.onload = () => {
          // Le SDK est chargé, maintenant on peut rendre le bouton
          if (window.paypal && formData.paymentMethod === "paypal") {
            renderPayPalButton();
          }
        };

        document.body.appendChild(script);
      } else if (formData.paymentMethod === "paypal") {
        // Le SDK est déjà chargé
        renderPayPalButton();
      }
    }, 300); // Délai de 300ms

    // Fonction pour rendre le bouton PayPal
    function renderPayPalButton() {
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = ""; // Nettoyer le contenu existant
        
        // Petite astuce pour animer le bouton PayPal une fois qu'il sera rendu
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
              // PayPal a ajouté des nœuds, on peut ajouter une classe pour l'animation
              const paypalButton = container.querySelector('[data-funding-source="paypal"]');
              if (paypalButton) {
                // Ajouter un effet de transition
                (paypalButton as HTMLElement).style.transition = "all 0.5s ease-out";
                (paypalButton as HTMLElement).style.transform = "scale(1)";
                (paypalButton as HTMLElement).style.opacity = "1";
                observer.disconnect(); // Arrêter d'observer une fois animé
              }
            }
          });
        });
        
        // Observer les changements dans le conteneur
        observer.observe(container, { childList: true, subtree: true });

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
            .catch((err: unknown) => {
              console.error("PayPal button render error:", err);
            });
        } catch (error) {
          console.error("Error creating PayPal button:", error);
        }
      }
    }
    
    return () => clearTimeout(timeoutId);
    
  }, [currentStep, formData.paymentMethod, total, navigate]); // Ajouter currentStep comme dépendance

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
                      className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30"
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
                      className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30"
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
                      className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30"
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
                      className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30"
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
                    className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30"
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
                      className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30"
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between">
                      <label
                        className="block text-gray-400 text-sm mb-2"
                        htmlFor="postalCode"
                      >
                        {t("checkout.postalCode")}
                      </label>
                    </div>
                    <motion.input
                      whileFocus={{
                        borderColor: "#d4af37",
                        boxShadow: "0 0 0 1px rgba(212,175,55,0.3)",
                      }}
                      className={`w-full bg-black border ${
                        isBrusselsPostalCode(formData.postalCode)
                          ? "border-green-500"
                          : "border-white/20"
                      } rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30`}
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
                      className="w-full bg-black border border-white/20 rounded-md px-3 py-2 text-gray-300 focus:outline-none focus:ring-1 focus:ring-white/30"
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
                      className="flex items-center space-x-3 p-3 border border-white/20 rounded-md bg-black"
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
                      className="flex items-center space-x-3 p-3 border border-white/20 rounded-md bg-black"
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

                {/* Credit card form has been removed */}

                {/* PayPal instructions */}
                {formData.paymentMethod === "paypal" && (
                  <motion.div
                    className="mt-4 p-4 border-2 border-yellow-500 rounded-md bg-black"
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
                    <motion.p
                      className="text-yellow-400 mb-4 font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {t("checkout.paypalMessage")}
                    </motion.p>

                    {/* Container pour le SDK PayPal - avec animation */}
                    <motion.div
                      id="paypal-button-container"
                      className="min-h-[60px]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                    ></motion.div>
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
                "0 10px 25px -5px rgba(255, 255, 255, 0.1), 0 8px 10px -6px rgba(255, 255, 255, 0.05)",
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
                  key={item.product.id}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                  custom={index}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "0.375rem",
                  }}
                >
                  <div className="flex-1">
                    <h3 className="text-gray-200 font-medium">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {item.product.size_ml ? `${item.product.size_ml}ml` : ""}{" "}
                      × {item.quantity}
                    </p>
                  </div>
                  <div className="text-white">
                    {(item.product.price * item.quantity).toFixed(2)}€
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
                <div>
                  <span>{t("checkout.shipping")}</span>
                  {shouldHaveFreeShipping && formData.postalCode && (
                    <span className="ml-2 text-xs text-green-500">
                      ({t("checkout.brusselsFreeShipping")})
                    </span>
                  )}
                </div>
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
