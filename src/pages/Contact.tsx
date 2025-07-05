import React from "react";
import { motion, easeInOut } from "framer-motion";
import type { Variants } from "framer-motion";
import ContactForm from "../components/contact/form";
import InfoDetails from "../components/contact/infoDetails";
import FAQ from "../components/contact/faq";
import { useTranslation } from "react-i18next"; // Ajout import

const Contact: React.FC = () => {
  const { t } = useTranslation(); // Ajout hook

  // Animation variants with proper typing
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeInOut },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-gray-200 relative"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10"></div>
        <img
          src="/contactcover.png"
          alt="Background"
          className="w-full h-full object-cover object-center opacity-60"
        />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative py-20 overflow-hidden z-10"
        variants={fadeIn}
      >
        {/* Remplace tous les fonds et effets beige par du blanc fort */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-serif text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("contact.title")}
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto text-gray-300 mb-8 drop-shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t("contact.subtitle")}
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Contact Form & Info Section */}
      <motion.section className="py-10 px-4 relative z-10" variants={fadeIn}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <InfoDetails />
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <div className="relative z-10">
        <FAQ />
      </div>
    </motion.div>
  );
};

export default Contact;
