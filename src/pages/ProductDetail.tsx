import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Images from "../components/productDetail/images";
import Details from "../components/productDetail/details";
import SeeAlso from "../components/productDetail/seeAlso";
import Toast from "../components/common/Toast";
import Description from "../components/productDetail/description";
import { useTranslation } from "react-i18next"; // Ajout import

// Skeleton Loader
const Skeleton = () => (
  <div className="flex flex-col lg:flex-row gap-10 items-center justify-center min-h-[600px] animate-pulse">
    <div className="w-80 h-96 bg-gray-800 rounded-xl" />
    <div className="w-full max-w-xl h-96 bg-gray-800 rounded-xl" />
  </div>
);
import productService from "../services/productService";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/api";
 

const ProductDetail: React.FC = () => {
  const { t } = useTranslation(); // Ajout hook
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Effect to load the product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProduct(Number(id));
        
        // Normalize the price field
        const normalizedProductData = {
          ...productData,
          price: typeof productData.price === "string" ? parseFloat(productData.price) : productData.price,
        };
        setProduct(normalizedProductData);
        
        // Get related products from the same category
        if (normalizedProductData.category_id) {
          const allProducts = await productService.getAllProducts();
          const related = allProducts
            .filter(p => p.category_id === normalizedProductData.category_id && p.id !== normalizedProductData.id)
            .slice(0, 3);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Effet pour animer les images en boucle
  useEffect(() => {
    if (product?.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          product.images && prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change toutes les 4 secondes

      return () => clearInterval(interval);
    }
  }, [product]);

  // Effet pour cacher le toast après un délai
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Gestion du toast pour PayPal
  const handlePayPalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setToastMessage(t("product.paypalMaintenance"));
    setShowToast(true);
  };

  // Handler for Add to Cart
  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
      setToastMessage("Le produit a été ajouté à votre panier.");
      setShowToast(true);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Toast de notification */}
      <AnimatePresence>
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Bouton retour vers /shop */}
        <Link
          to="/shop"
          className="inline-flex items-center text-white hover:text-white mb-8 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("product.backToShop")}
        </Link>

        {/* Skeleton Loader */}
        {loading && <Skeleton />}

        {/* Produit non trouvé */}
        {!loading && !product && (
          <motion.div
            className="min-h-screen bg-black py-12 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl font-serif text-white mb-4">
                {t("product.notFoundTitle")}
              </h2>
              <p className="text-white mb-8">{t("product.notFoundText")}</p>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-colors duration-300"
              >
                {t("product.backToShop")}
              </button>
            </div>
          </motion.div>
        )}

        {/* Affichage du produit */}
        {!loading && product && (
          <>
            <div className="flex flex-col lg:flex-row gap-10 items-center justify-center min-h-[600px]">
              {/* Composant Images */}
              <Images
                images={product.images}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
                productName={product.name}
              />

              {/* Composant Details */}
              <Details
                product={product}
                onAddToCart={handleAddToCart}
                onPayPalClick={handlePayPalClick}
              />
            </div>

        {product && (
          <Description
            description={product.description ?? ""}
            ingredientsDescription={product.olfactive_notes}
          />
        )}

            {/* Composant SeeAlso */}
            
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetail;
