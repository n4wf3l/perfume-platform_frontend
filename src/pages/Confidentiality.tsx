import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confidentiality from "../components/confidentiality/confidentiality";
import Terms from "../components/confidentiality/terms";
import Cookies from "../components/confidentiality/cookies";
import FAQ from "../components/confidentiality/faq";

const ConfidentialityPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "confidentiality" | "terms" | "cookies"
  >("confidentiality");

  // Titre dynamique selon la section
  const sectionTitles: Record<typeof activeSection, string> = {
    confidentiality: "Politique de Confidentialité",
    terms: "Mentions Légales",
    cookies: "Gestion des Cookies",
  };

  const scrollToHash = () => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    scrollToHash();
  }, [activeSection]);

  return (
    <motion.div
      className="min-h-screen bg-black text-gray-200 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation haute */}
      <motion.nav
        className="w-full bg-black border-b border-white/20 flex justify-center gap-8 py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <button
          onClick={() => setActiveSection("confidentiality")}
          className={`font-serif text-xl transition ${
            activeSection === "confidentiality"
              ? "text-white underline underline-offset-4"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Confidentialité
        </button>
        <button
          onClick={() => setActiveSection("terms")}
          className={`font-serif text-xl transition ${
            activeSection === "terms"
              ? "text-white underline underline-offset-4"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Mentions légales
        </button>
        <button
          onClick={() => setActiveSection("cookies")}
          className={`font-serif text-xl transition ${
            activeSection === "cookies"
              ? "text-white underline underline-offset-4"
              : "text-gray-300 hover:text-white"
          }`}
        >
          Cookies
        </button>
      </motion.nav>

      {/* Contenu principal */}
      <motion.main
        className="flex-grow w-full max-w-3xl mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-8 text-center drop-shadow">
          {sectionTitles[activeSection]}
        </h1>
        {activeSection === "confidentiality" && <Confidentiality />}
        {activeSection === "terms" && <Terms />}
        {activeSection === "cookies" && <Cookies />}
      </motion.main>

      {/* FAQ en bas de page */}
      <motion.footer
        className="w-full bg-gradient-to-t from-black via-[#181818] to-transparent pt-12 pb-8 border-t border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <FAQ />
      </motion.footer>
    </motion.div>
  );
};

export default ConfidentialityPage;
