import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// Ajout du composant Toast simple
const Toast: React.FC<{ message: React.ReactNode; onClose: () => void }> = ({
  message,
  onClose,
}) => (
  <div className="fixed bottom-6 right-6 z-[9999]">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.3 }}
      className="bg-black text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white text-xl font-bold focus:outline-none"
        aria-label="Fermer"
      >
        ×
      </button>
    </motion.div>
  </div>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"fr" | "en" | "nl">(
    "fr"
  );
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangMenu = () => setIsLangMenuOpen((v) => !v);

  const changeLanguage = (lng: "fr" | "en" | "nl") => {
    setCurrentLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Noms longs pour le menu déroulant
  const languageLabels = {
    fr: "Français",
    en: "English",
    nl: "Nederlands",
  };

  // Labels courts pour l'affichage compact
  const languageShort = {
    fr: "FR",
    en: "EN",
    nl: "NL",
  };

  // Lien WhatsApp (remplace le numéro par le tien)
  const whatsappUrl = "https://wa.me/33612345678";

  return (
    <header className="bg-black border-b border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-white font-serif text-2xl md:text-3xl">
                Sogno D'Oro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300 hover:text-white"
              } 
                transition-colors duration-200 px-1 py-2 text-sm font-medium`}
            >
              Accueil
            </Link>
            <Link
              to="/shop"
              className={`${
                isActive("/shop")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300 hover:text-white"
              } 
                transition-colors duration-200 px-1 py-2 text-sm font-medium`}
            >
              Boutique
            </Link>
            <Link
              to="/about"
              className={`${
                isActive("/about")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300 hover:text-white"
              } 
                transition-colors duration-200 px-1 py-2 text-sm font-medium`}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className={`${
                isActive("/contact")
                  ? "text-white border-b-2 border-white"
                  : "text-gray-300 hover:text-white"
              } 
                transition-colors duration-200 px-1 py-2 text-sm font-medium`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Elements */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher Menu */}
            <div className="hidden md:flex items-center space-x-6 relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest px-2 py-1 text-gray-300 hover:text-white transition relative"
              >
                {languageShort[currentLanguage]}
                <svg
                  className={`w-4 h-4 ml-1 transition-transform ${
                    isLangMenuOpen ? "rotate-180" : ""
                  }`}
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
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    key="lang-dropdown"
                    initial={{ opacity: 0, y: -10, x: 0 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -10, x: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="absolute left-0 top-full mt-2 bg-black border border-white/20 rounded-lg shadow-lg z-50 min-w-[140px] flex flex-col"
                    style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)" }}
                    onMouseLeave={() => setIsLangMenuOpen(false)}
                  >
                    {(["fr", "en", "nl"] as const).map((lng) => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`px-4 py-2 text-left text-sm font-medium transition ${
                          currentLanguage === lng
                            ? "bg-white text-black"
                            : "text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {languageLabels[lng]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <button
              onClick={() => setShowToast(true)}
              className="text-gray-300 hover:text-white"
              aria-label="Ouvrir le panier"
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-white text-xs text-black font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </div>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white focus:outline-none"
              aria-label="Ouvrir le menu"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          >
            {/* Close button */}
            <button
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition"
              aria-label="Fermer le menu"
            >
              <X size={32} />
            </button>

            <motion.nav
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-8 text-white text-xl font-light w-full px-8"
            >
              <Link
                to="/"
                onClick={toggleMenu}
                className={`w-full text-center py-3 rounded-lg transition ${
                  isActive("/")
                    ? "bg-white/10 text-white font-semibold"
                    : "hover:bg-white/5"
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/shop"
                onClick={toggleMenu}
                className={`w-full text-center py-3 rounded-lg transition ${
                  isActive("/shop")
                    ? "bg-white/10 text-white font-semibold"
                    : "hover:bg-white/5"
                }`}
              >
                Boutique
              </Link>
              <Link
                to="/about"
                onClick={toggleMenu}
                className={`w-full text-center py-3 rounded-lg transition ${
                  isActive("/about")
                    ? "bg-white/10 text-white font-semibold"
                    : "hover:bg-white/5"
                }`}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                onClick={toggleMenu}
                className={`w-full text-center py-3 rounded-lg transition ${
                  isActive("/contact")
                    ? "bg-white/10 text-white font-semibold"
                    : "hover:bg-white/5"
                }`}
              >
                Contact
              </Link>

              {/* Langues */}
              <div className="flex flex-row justify-center items-center gap-6 pt-6 w-full">
                {(["fr", "en", "nl"] as const).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      changeLanguage(lng);
                      toggleMenu();
                    }}
                    className="relative text-lg font-bold uppercase tracking-widest px-2 py-1 text-gray-300 hover:text-white transition"
                  >
                    {lng}
                    {currentLanguage === lng && (
                      <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Paypal maintenance */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={
              <>
                Paypal est actuellement en maintenance.
                <br />
                Passez par{" "}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-white font-bold"
                >
                  Whatsapp
                </a>
                .
              </>
            }
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
