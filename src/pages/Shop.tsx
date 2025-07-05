import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeaderShop from "../components/shop/headerShop";
import Products from "../components/shop/products";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import type { Product, Category } from "../types/api";
  
const Shop: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const productsPerPage = 6;

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories()
        ]);
        console.log("Fetched Products Data:", productsData);

        const normalizedProductsData = productsData.map(product => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
        }));

        setProducts(normalizedProductsData);
        setFilteredProducts(normalizedProductsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Une erreur s'est produite lors du chargement des produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search, category and gender
  useEffect(() => {
    if (products.length === 0) {
      return; // Skip filtering if products are not yet fetched
    }

    let result = products;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category_id === selectedCategory
      );
    }

    // Filter by gender
    if (selectedGender !== "all") {
      result = result.filter((product) => product.gender === selectedGender);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Return to first page when filters change
  }, [searchTerm, selectedCategory, selectedGender, products]);

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
        {loading ? (
          <div className="text-center">
            <p className="text-white">Chargement des produits...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            {/* En-tête avec recherche et catégories */}
            <HeaderShop
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              categories={categories}
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
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Shop;
