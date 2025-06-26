import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fr");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lng: string) => {
    setCurrentLanguage(lng);
    setIsLangMenuOpen(false);
  };

  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Noms des langues en français
  const languageNames = {
    en: "Anglais",
    fr: "Français",
    nl: "Néerlandais",
  };

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
            <div className="hidden md:block relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-300 hover:text-white"
              >
                <span>
                  {languageNames[currentLanguage as keyof typeof languageNames]}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${
                    isLangMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Language Dropdown Menu */}
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 py-2 w-40 bg-black rounded-md shadow-lg z-50 border border-gray-700">
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === "en"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    Anglais
                  </button>
                  <button
                    onClick={() => changeLanguage("fr")}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === "fr"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage("nl")}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === "nl"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    Néerlandais
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="text-gray-300 hover:text-white">
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
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden bg-gray-900 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-[#d4af37] hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Ouvrir le menu</span>
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

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
          <Link
            to="/"
            className={`${
              isActive("/")
                ? "bg-gray-900 text-[#d4af37]"
                : "text-gray-300 hover:bg-gray-800 hover:text-[#d4af37]"
            } 
              block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/shop"
            className={`${
              isActive("/shop")
                ? "bg-gray-900 text-[#d4af37]"
                : "text-gray-300 hover:bg-gray-800 hover:text-[#d4af37]"
            } 
              block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Boutique
          </Link>
          <Link
            to="/about"
            className={`${
              isActive("/about")
                ? "bg-gray-900 text-[#d4af37]"
                : "text-gray-300 hover:bg-gray-800 hover:text-[#d4af37]"
            } 
              block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            À propos
          </Link>
          <Link
            to="/contact"
            className={`${
              isActive("/contact")
                ? "bg-gray-900 text-[#d4af37]"
                : "text-gray-300 hover:bg-gray-800 hover:text-[#d4af37]"
            } 
              block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>

          {/* Mobile Language Menu */}
          <div className="pt-4 border-t border-gray-800">
            <p className="px-3 text-sm text-gray-400 mb-2">Langue</p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  changeLanguage("en");
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentLanguage === "en"
                    ? "bg-[#c5a028]/20 text-[#d4af37]"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                Anglais
              </button>
              <button
                onClick={() => {
                  changeLanguage("fr");
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentLanguage === "fr"
                    ? "bg-[#c5a028]/20 text-[#d4af37]"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                Français
              </button>
              <button
                onClick={() => {
                  changeLanguage("nl");
                  setIsMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentLanguage === "nl"
                    ? "bg-[#c5a028]/20 text-[#d4af37]"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                Néerlandais
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
