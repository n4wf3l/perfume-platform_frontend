import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Catégories dynamiques via i18n
const categories = [
  { id: "all", nameKey: "shop.categories.all" },
  { id: "floral", nameKey: "shop.categories.floral" },
  { id: "woody", nameKey: "shop.categories.woody" },
  { id: "oriental", nameKey: "shop.categories.oriental" },
  { id: "fresh", nameKey: "shop.categories.fresh" },
];

interface HeaderShopProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
}

const HeaderShop: React.FC<HeaderShopProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedGender,
  setSelectedGender,
}) => {
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const { t } = useTranslation();

  // Genres dynamiques via i18n
  const genders = [
    { id: "all", label: t("shop.genders.all") },
    { id: "homme", label: t("shop.genders.homme") },
    { id: "femme", label: t("shop.genders.femme") },
    { id: "unisexe", label: t("shop.genders.unisexe") },
  ];

  // Fonction pour forcer la majuscule (compatible multilingue)
  const toUpper = (str: string) => (str ? str.toLocaleUpperCase() : "");

  return (
    <div className="mb-16">
      <motion.h1
        className="text-4xl font-serif text-white text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {t("shop.headerTitle")}
      </motion.h1>

      {/* Barre de recherche centrée */}
      <motion.div
        className="flex justify-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("shop.searchPlaceholder")}
            className="w-full bg-black border border-gray-700 rounded-full py-3 px-6 text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Onglets de catégories */}
      <motion.div
        className="w-full overflow-x-auto scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Desktop */}
        <div className="hidden md:flex justify-center min-w-max w-full pb-2">
          <div className="flex space-x-8 border-b border-gray-700 w-full max-w-4xl">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-2 py-3 text-sm font-medium tracking-wider transition-colors duration-300 ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {toUpper(t(category.nameKey))}
                {selectedCategory === category.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Mobile */}
        <div className="md:hidden flex justify-center w-full pb-2">
          <div className="relative w-full max-w-xs">
            <button
              onClick={() => setCatDropdownOpen((v) => !v)}
              className="w-full flex justify-between items-center px-4 py-3 bg-black border border-gray-700 rounded-lg text-white font-medium text-base focus:outline-none"
            >
              {toUpper(
                t(
                  categories.find((c) => c.id === selectedCategory)?.nameKey ||
                    "shop.categories.category"
                )
              )}
              <svg
                className={`w-5 h-5 ml-2 transition-transform ${
                  catDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Overlay déroulant plein écran */}
            <motion.div
              initial={false}
              animate={catDropdownOpen ? "open" : "closed"}
              variants={{
                open: { opacity: 1, pointerEvents: "auto" },
                closed: { opacity: 0, pointerEvents: "none" },
              }}
              transition={{ duration: 0.2 }}
              className={`fixed inset-0 z-40 bg-black/90 flex flex-col items-center justify-center ${
                catDropdownOpen ? "" : "pointer-events-none"
              }`}
              style={{ display: catDropdownOpen ? "flex" : "none" }}
            >
              {/* Fermer */}
              <button
                onClick={() => setCatDropdownOpen(false)}
                className="absolute top-6 right-6 text-white text-3xl"
                aria-label={t("shop.close")}
              >
                ×
              </button>
              <ul className="w-full max-w-xs space-y-4 px-6">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCatDropdownOpen(false);
                      }}
                      className={`w-full text-center py-4 text-lg  rounded-lg transition ${
                        selectedCategory === category.id
                          ? "bg-white text-black"
                          : "bg-black text-white hover:bg-white/10"
                      }`}
                    >
                      {toUpper(t(category.nameKey))}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filtres genre */}
      <div className="flex justify-center gap-4 mt-6">
        {genders.map((gender) => (
          <button
            key={gender.id}
            onClick={() => setSelectedGender(gender.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedGender === gender.id
                ? "bg-white text-black"
                : "bg-gray-900 text-white hover:bg-white hover:text-black"
            }`}
          >
            {gender.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderShop;
