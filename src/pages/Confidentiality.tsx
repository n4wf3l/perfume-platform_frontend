import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confidentiality from "../components/confidentiality/confidentiality";
import Terms from "../components/confidentiality/terms";
import Cookies from "../components/confidentiality/cookies";
import FAQ from "../components/confidentiality/faq";

const ConfidentialityPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<
    "confidentiality" | "terms" | "cookies"
  >("confidentiality");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  // Pour bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showMobileMenu]);

  return (
    <motion.div
      className="min-h-screen bg-black text-gray-200 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation haute */}
      <motion.nav
        className="w-full bg-black border-b border-white/20 flex justify-center gap-8 py-8 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Desktop */}
        <div className="hidden sm:flex w-full justify-center gap-8">
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
        </div>
        {/* Mobile */}
        <div className="flex sm:hidden w-full justify-center">
          <button
            className="text-white bg-black border border-white/20 rounded-lg px-4 py-2 text-lg font-serif flex items-center gap-2"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Ouvrir le menu de navigation"
          >
            {sectionTitles[activeSection]}
            <svg
              className="w-5 h-5 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
        {/* Overlay mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
            >
              {/* Fermer */}
              <button
                onClick={() => setShowMobileMenu(false)}
                className="absolute top-6 right-6 text-white text-3xl"
                aria-label="Fermer"
              >
                ×
              </button>
              <nav className="flex flex-col gap-8 w-full max-w-xs px-6">
                <button
                  onClick={() => {
                    setActiveSection("confidentiality");
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-center py-4 text-xl font-serif rounded-lg transition ${
                    activeSection === "confidentiality"
                      ? "bg-white text-black"
                      : "bg-black text-white hover:bg-white/10"
                  }`}
                >
                  Confidentialité
                </button>
                <button
                  onClick={() => {
                    setActiveSection("terms");
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-center py-4 text-xl font-serif rounded-lg transition ${
                    activeSection === "terms"
                      ? "bg-white text-black"
                      : "bg-black text-white hover:bg-white/10"
                  }`}
                >
                  Mentions légales
                </button>
                <button
                  onClick={() => {
                    setActiveSection("cookies");
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-center py-4 text-xl font-serif rounded-lg transition ${
                    activeSection === "cookies"
                      ? "bg-white text-black"
                      : "bg-black text-white hover:bg-white/10"
                  }`}
                >
                  Cookies
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
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
