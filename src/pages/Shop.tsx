import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeaderShop from "../components/shop/headerShop";
import Products from "../components/shop/products";

// Produits avec descriptions en français et images mises à jour
const allProducts = [
  {
    id: 1,
    name: "Sogno Intenso",
    description:
      "Notre parfum signature aux notes d'ambre, de vanille et de bois de santal.",
    price: 149.99,
    images: ["/perfums.jpg"],
    category: "oriental",
    gender: "unisexe",
  },
  {
    id: 2,
    name: "Luna Dorata",
    description: "Mélange floral et d'agrumes avec des notes boisées.",
    price: 129.99,
    images: ["/perfum1.jpg"],
    category: "floral",
    gender: "femme",
  },
  {
    id: 3,
    name: "Notte Stellata",
    description: "Un mélange luxueux d'épices exotiques et de musc.",
    price: 139.99,
    images: ["/perfum2.jpg"],
    category: "oriental",
    gender: "homme",
  },
  {
    id: 4,
    name: "Velluto Nero",
    description: "Profond et mystérieux avec des notes de oud et de patchouli.",
    price: 159.99,
    images: ["/perfum3.jpg"],
    category: "woody",
    gender: "unisexe",
  },
  {
    id: 5,
    name: "Aria Marina",
    description:
      "Fraîche brise marine avec des notes d'agrumes et légèrement florales.",
    price: 119.99,
    images: ["/perfum1.jpg"],
    category: "fresh",
    gender: "femme",
  },
  {
    id: 6,
    name: "Rosa D'Oro",
    description:
      "Mélange luxueux de rose, de pivoine et de subtiles notes fruitées.",
    price: 134.99,
    images: ["/perfum2.jpg"],
    category: "floral",
    gender: "femme",
  },
  {
    id: 7,
    name: "Bosco Profondo",
    description:
      "Essence profonde de forêt avec du cèdre, du pin et des notes terreuses.",
    price: 144.99,
    images: ["/perfum3.jpg"],
    category: "woody",
    gender: "homme",
  },
  {
    id: 8,
    name: "Brezza Fresca",
    description:
      "Léger et vivifiant avec de la bergamote, du citron et de la menthe.",
    price: 124.99,
    images: ["/perfums.jpg"],
    category: "fresh",
    gender: "unisexe",
  },
];

const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [selectedGender, setSelectedGender] = useState("all");
  const productsPerPage = 6;

  useEffect(() => {
    let result = allProducts;

    // Filtre par terme de recherche
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filtre par genre
    if (selectedGender !== "all") {
      result = result.filter((product) => product.gender === selectedGender);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Retour à la première page quand les filtres changent
  }, [searchTerm, selectedCategory, selectedGender]);

  // Obtenir les produits pour la pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <motion.div
      className="min-h-screen bg-black text-gray-200 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec recherche et catégories */}
        <HeaderShop
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
        />

        {/* Titre de la boutique */}
        <h1 className="text-4xl font-serif text-white mb-8 text-center">
          Boutique
        </h1>

        {/* Section des produits et pagination */}
        <Products
          products={currentProducts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
        />
      </div>
    </motion.div>
  );
};

export default Shop;
