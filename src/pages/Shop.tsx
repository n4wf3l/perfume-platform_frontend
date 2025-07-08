import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeaderShop from "../components/shop/headerShop";
import Products from "../components/shop/products";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import type { Product, Category } from "../types/api";
import { Helmet } from "react-helmet";

const Shop: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const genderParam = searchParams.get("gender"); // "homme" ou "femme" ou null

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
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
          categoryService.getAllCategories(),
        ]);
        console.log("Fetched Products Data:", productsData);

        const normalizedProductsData = productsData.map((product) => ({
          ...product,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
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
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
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

  // Récupérer le paramètre gender de l'URL
  useEffect(() => {
    // Si un genre est spécifié dans l'URL, mettre à jour le filtre
    if (genderParam && ["homme", "femme", "unisexe"].includes(genderParam)) {
      setSelectedGender(genderParam);
    }

    // Récupérer d'autres paramètres si nécessaire (ex: category)
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(
        categoryParam === "all" ? "all" : Number(categoryParam)
      );
    }
  }, [searchParams]); // Se déclenche quand les paramètres d'URL changent

  return (
    <>
      {/* Meta tags SEO pour la page Shop */}
      <Helmet>
        <title>
          Collection de Parfums | SOGNO D'ORO® | Belgian Luxury Perfums
        </title>
        <meta
          name="description"
          content="Explorez notre collection exclusive de parfums de luxe pour femme et homme. Des fragrances uniques créées avec les meilleurs ingrédients pour un parfum qui vous ressemble."
        />

        {/* Liens canoniques */}
        <link rel="canonical" href="https://www.sognodoro.be/shop" />

        {/* Open Graph Tags pour Facebook/Instagram */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Collection de Parfums | SOGNO D'ORO"
        />
        <meta
          property="og:description"
          content="Découvrez notre collection exclusive de parfums de luxe. Des fragrances qui racontent votre histoire."
        />
        <meta property="og:url" content="https://www.sognodoro.be/shop" />
        <meta
          property="og:image"
          content="https://www.sognodoro.be/shop-collection.jpg"
        />
        <meta property="og:site_name" content="SOGNO D'ORO" />

        {/* Structured Data pour la collection de produits */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Collection de Parfums SOGNO D'ORO",
              "description": "Notre collection exclusive de parfums de luxe belges pour femme et homme",
              "url": "https://www.sognodoro.be/shop",
              "isPartOf": {
                "@type": "WebSite",
                "name": "SOGNO D'ORO",
                "url": "https://www.sognodoro.be"
              },
              "about": {
                "@type": "Brand",
                "name": "SOGNO D'ORO",
                "url": "https://www.sognodoro.be",
                "logo": "https://www.sognodoro.be/logo.png",
                "sameAs": [
                  "https://www.instagram.com/sogno.doro_profumo",
                  "https://snapchat.com/add/sogno-doro"
                ]
              }
            }
          `}
        </script>
      </Helmet>

      <motion.div
        className="min-h-screen bg-black text-gray-200 py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <div className="w-12 h-12 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
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
                {t("shop.title")}
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
    </>
  );
};

export default Shop;
