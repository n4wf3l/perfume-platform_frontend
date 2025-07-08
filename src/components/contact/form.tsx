import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next"; // Ajout import

interface FormProps {
  // Props si nécessaire
}

// Options du menu déroulant (désormais traduites dynamiquement)
const subjectKeys = [
  { value: "", labelKey: "contact.form.subjectPlaceholder", disabled: true },
  {
    value: "customer-service",
    labelKey: "contact.form.subjectCustomerService",
  },
  { value: "product-inquiry", labelKey: "contact.form.subjectProductInquiry" },
  { value: "wholesale", labelKey: "contact.form.subjectWholesale" },
  { value: "press", labelKey: "contact.form.subjectPress" },
  { value: "other", labelKey: "contact.form.subjectOther" },
];

// Composant menu déroulant personnalisé
const CustomSelect = ({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (name: string, value: string) => void;
  name: string;
}) => {
  const { t } = useTranslation(); // Ajout hook
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Gérer la sélection d'une option
  const handleSelect = (optionValue: string) => {
    onChange(name, optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Animation pour le menu déroulant
  const dropdownVariants: Variants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -5,
      transition: {
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const currentLabel = subjectKeys.find((option) => option.value === value)
    ? t(subjectKeys.find((option) => option.value === value)!.labelKey)
    : t("contact.form.subjectPlaceholder");

  return (
    <div className="relative" ref={selectRef}>
      <label className="block text-sm text-gray-400 mb-1">
        {t("contact.form.subjectLabel")}
      </label>

      <motion.div
        className={`w-full px-4 py-3 bg-black border ${
          isOpen ? "border-white" : "border-gray-800"
        } rounded-md text-gray-200 cursor-pointer flex justify-between items-center`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ borderColor: "rgba(255,255,255,0.5)" }}
        animate={{
          boxShadow: isOpen ? "0 0 0 1px rgba(255,255,255,0.5)" : "none",
        }}
      >
        <span className={value ? "text-gray-200" : "text-gray-500"}>
          {currentLabel}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 w-full mt-1 bg-gray-900 border border-white/30 rounded-md overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {subjectKeys
              .filter((option) => !option.disabled)
              .map((option, index) => (
                <motion.div
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer ${
                    option.value === value
                      ? "bg-white/20 text-white"
                      : highlightedIndex === index
                      ? "bg-gray-800 text-gray-200"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  whileTap={{ scale: 0.98 }}
                >
                  {t(option.labelKey)}
                </motion.div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactForm: React.FC<FormProps> = () => {
  const { t } = useTranslation(); // Ajout hook

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formError, setFormError] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select change from custom component
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setFormError("");

    // Validation simple
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setFormStatus("error");
      setFormError(t("contact.form.error"));
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setFormStatus("error");
        setFormError(t("contact.form.error"));
      }
    } catch (error) {
      setFormStatus("error");
      setFormError(t("contact.form.error"));
    }
  };

  // Animation variants - Déroulement plus doux
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.45, 0.18, 1] },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Plus lent pour un déroulement doux
        delayChildren: 0.3,
        ease: [0.6, 0.05, 0.01, 0.99],
      },
    },
  };

  const formContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3,
      },
    },
  };

  // Ajoutez cette fonction au-dessus du return du composant ContactForm
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.subject !== "" &&
      formData.message.trim() !== ""
    );
  };

  return (
    <motion.div
      variants={formContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="overflow-hidden"
    >
      <motion.div
        className="bg-black rounded-xl border border-white/20 overflow-hidden shadow-lg shadow-white/5"
        whileHover={{ boxShadow: "0 0 30px 0 rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-8 md:p-10">
          <motion.h2
            className="text-2xl md:text-3xl font-serif text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.45, 0.18, 1] }}
            viewport={{ once: true }}
          >
            {t("contact.form.title")}
          </motion.h2>

          <AnimatePresence mode="wait">
            {formStatus === "success" && (
              <motion.div
                className="bg-green-900/30 border border-green-700/50 text-green-400 rounded-md p-5 mb-8"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 mt-0.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <div className="font-medium mb-1">
                      {t("contact.form.success")}
                    </div>
                    <div className="text-sm text-green-400/80">
                      {t("contact.form.successSub")}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {formStatus === "error" && (
              <motion.div
                className="bg-red-900/30 border border-red-700/50 text-red-400 rounded-md p-5 mb-8"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 mt-0.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="font-medium mb-1">
                      {t("contact.form.errorTitle")}
                    </div>
                    <div className="text-sm text-red-400/80">{formError}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-7">
              {/* Name Field with floating label */}
              <motion.div className="relative" variants={fadeInUp}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block px-5 pt-6 pb-2 w-full text-gray-200 bg-black rounded-md appearance-none focus:outline-none focus:ring-white focus:border-white border border-gray-800 peer transition-all duration-300"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="name"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-white"
                >
                  {t("contact.form.name")}
                </label>
              </motion.div>

              {/* Email Field with floating label */}
              <motion.div className="relative" variants={fadeInUp}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block px-5 pt-6 pb-2 w-full text-gray-200 bg-black rounded-md appearance-none focus:outline-none focus:ring-white focus:border-white border border-gray-800 peer transition-all duration-300"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-white"
                >
                  {t("contact.form.email")}
                </label>
              </motion.div>

              {/* Custom Subject dropdown */}
              <motion.div variants={fadeInUp}>
                <CustomSelect
                  value={formData.subject}
                  onChange={handleSelectChange}
                  name="subject"
                />
              </motion.div>

              {/* Message Field with floating label */}
              <motion.div className="relative" variants={fadeInUp}>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="block px-5 pt-6 pb-2 w-full text-gray-200 bg-black rounded-md appearance-none focus:outline-none focus:ring-white focus:border-white border border-gray-800 peer resize-none transition-all duration-300"
                  placeholder=" "
                  required
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-white"
                >
                  {t("contact.form.message")}
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={buttonVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <button
                  type="submit"
                  disabled={formStatus === "submitting" || !isFormValid()}
                  className={`w-full px-8 py-4 bg-white hover:bg-white/90 text-black font-medium rounded-md transition-all duration-300 flex items-center justify-center ${
                    formStatus === "submitting" || !isFormValid()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {formStatus === "submitting" && (
                    <motion.svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
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
                  <span className="tracking-wide">
                    {formStatus === "submitting"
                      ? t("contact.form.sending")
                      : t("contact.form.send")}
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
