import React from "react";
import { motion } from "framer-motion";
import type { Category } from "../../types/api";

interface HeaderShopProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: number | "all";
  setSelectedCategory: (category: number | "all") => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  categories?: Category[];
}

const HeaderShop: React.FC<HeaderShopProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedGender,
  setSelectedGender,
  categories = [],
}) => {
  return (
    <div className="mb-16">
      <motion.h1
        className="text-4xl font-serif text-white text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Notre Collection
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
            placeholder="Rechercher un parfum..."
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
        <div className="flex justify-center min-w-max w-full pb-2">
          <div className="flex space-x-8 border-b border-gray-700 w-full max-w-4xl">
            <button
              key="all"
              onClick={() => setSelectedCategory("all")}
              className={`relative px-2 py-3 text-sm font-medium tracking-wider transition-colors duration-300 ${
                selectedCategory === "all"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              TOUS LES PARFUMS
              {selectedCategory === "all" && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
            
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-2 py-3 text-sm font-medium tracking-wider transition-colors duration-300 ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {category.name.toUpperCase()}
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
      </motion.div>

      {/* Filtres genre */}
      <div className="flex justify-center gap-4 mt-6">
        {["all", "homme", "femme", "unisexe"].map((gender) => (
          <button
            key={gender}
            onClick={() => setSelectedGender(gender)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedGender === gender
                ? "bg-white text-black"
                : "bg-gray-900 text-white hover:bg-white hover:text-black"
            }`}
          >
            {gender === "all"
              ? "Tous"
              : gender.charAt(0).toUpperCase() + gender.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderShop;
