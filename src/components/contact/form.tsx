import React, { useState } from "react";
import { motion, easeOut } from "framer-motion";
import type { Variants } from "framer-motion";

interface FormProps {
  // Props si nécessaire
}

const ContactForm: React.FC<FormProps> = () => {
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");

    // Simulate form submission
    setTimeout(() => {
      if (Math.random() > 0.2) {
        // 80% success rate
        setFormStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setFormStatus("error");
        setFormError("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
    }, 1500);
  };

  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeOut },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <motion.div
        className="bg-black rounded-xl border border-[#d4af37]/20 overflow-hidden shadow-lg shadow-[#d4af37]/5"
        whileHover={{ boxShadow: "0 0 20px 0 rgba(212, 175, 55, 0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          <motion.h2
            className="text-2xl font-serif text-[#d4af37] mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Entrer en Contact
          </motion.h2>

          {formStatus === "success" && (
            <motion.div
              className="bg-green-900/20 border border-green-700 text-green-400 rounded-md p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              Message envoyé avec succès. Nous vous répondrons dans les plus
              brefs délais.
            </motion.div>
          )}

          {formStatus === "error" && (
            <motion.div
              className="bg-red-900/20 border border-red-700 text-red-400 rounded-md p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {formError}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              {/* Name Field with floating label */}
              <motion.div className="relative" variants={fadeInUp}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block px-4 pt-6 pb-1 w-full text-gray-200 bg-black rounded-md appearance-none focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] border border-gray-800 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="name"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#d4af37]"
                >
                  Nom
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
                  className="block px-4 pt-6 pb-1 w-full text-gray-200 bg-black rounded-md appearance-none focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] border border-gray-800 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#d4af37]"
                >
                  Email
                </label>
              </motion.div>

              {/* Subject dropdown */}
              <motion.div className="relative" variants={fadeInUp}>
                <label
                  htmlFor="subject"
                  className="block text-sm text-gray-400 mb-1"
                >
                  Sujet
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-md text-gray-200 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] appearance-none"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="customer-service">Service client</option>
                  <option value="product-inquiry">
                    Renseignements sur les produits
                  </option>
                  <option value="wholesale">Vente en gros</option>
                  <option value="press">Presse</option>
                  <option value="other">Autre</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#d4af37] mt-6">
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
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </motion.div>

              {/* Message Field with floating label */}
              <motion.div className="relative" variants={fadeInUp}>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="block px-4 pt-6 pb-1 w-full text-gray-200 bg-black rounded-md appearance-none focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] border border-gray-800 peer"
                  placeholder=" "
                  required
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#d4af37]"
                >
                  Message
                </label>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className={`w-full px-6 py-3 bg-[#d4af37] hover:bg-[#c5a028] text-black font-medium rounded-md transition-colors duration-300 flex items-center justify-center ${
                    formStatus === "submitting"
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {formStatus === "submitting" && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    </svg>
                  )}
                  {formStatus === "submitting"
                    ? "Envoi en cours..."
                    : "Envoyer"}
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
