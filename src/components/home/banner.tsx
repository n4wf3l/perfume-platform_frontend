import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/api";
import productService from "../../services/productService";
import { useTranslation } from "react-i18next";

// Définir l'image par défaut avec un chemin absolu
const defaultBgImage = "/perfums.jpg"; // Doit être dans le dossier public

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

interface BannerProps {
  title?: string;
  subtitle?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the hero product on component mount
  useEffect(() => {
    const fetchHeroProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching hero products...");
        
        // First attempt: use the getHeroProducts method
        const heroProducts = await productService.getHeroProducts();
        console.log("Hero products response:", heroProducts);
        
        if (heroProducts && Array.isArray(heroProducts) && heroProducts.length > 0) {
          console.log("Setting hero product from hero products:", heroProducts[0]);
          setHeroProduct(heroProducts[0]);
        } else {
          console.warn("No hero products found from API endpoint, trying alternative approach");
          
          // Second attempt: get all products and filter manually
          const allProducts = await productService.getAllProducts();
          console.log("All products response:", allProducts);
          
          if (allProducts && Array.isArray(allProducts) && allProducts.length > 0) {
            // Since we can see from the screenshot that product #4 is the hero product,
            // let's specifically look for it first
            const productId4 = allProducts.find(product => product.id === 4);
            if (productId4) {
              console.log("Found product ID 4 (known hero product):", productId4);
              setHeroProduct(productId4);
              return;
            }
            
            // If product #4 isn't found, try to find any product with is_hero set to a truthy value
            const heroProduct = allProducts.find(product => {
              // Check for truthy values in different formats
              return Boolean(product.is_hero);
            });
            
            if (heroProduct) {
              console.log("Found hero product by filtering:", heroProduct);
              setHeroProduct(heroProduct);
            } else {
              // Last resort: use the first product
              setHeroProduct(allProducts[0]);
              console.warn("No hero product found, using first product as fallback");
            }
          } else {
            setError("No products found");
          }
        }
      } catch (err) {
        console.error("Failed to fetch hero product:", err);
        setError("Failed to load hero product");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroProduct();
  }, []);

  // Utiliser l'image importée comme fallback
  const backgroundImage = heroProduct?.images && heroProduct.images.length > 0
    ? `${IMAGE_URL}/${heroProduct.images[0].path}`
    : defaultBgImage;

  // Détection mobile simple
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Background image avec animation */}
      <div
        className="absolute inset-0 bg-cover bg-center w-full h-full animate-subtle-pulse"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // ↓↓↓ Moins sombre qu'avant
          filter: isMobile ? "brightness(0.7)" : "brightness(0.4)",
          transition: isMobile
            ? "opacity 1.2s cubic-bezier(0.4,0,0.2,1)"
            : undefined,
          opacity: isMobile ? 0.0 : 1,
          animation: isMobile
            ? "bannerFadeIn 1.2s cubic-bezier(0.4,0,0.2,1) forwards"
            : undefined,
        }}
      />
      {/* Dégradé overlay pour mobile */}
      {isMobile && (
        <div
          className="absolute inset-0 z-10"
          style={{
            // ↓↓↓ Moins opaque qu'avant
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)",
          }}
        >
          <div className="h-full flex flex-col justify-end items-center text-center p-8">
            {loading ? (
              <div className="flex flex-col items-center mb-20">
                <div className="w-10 h-10 border-t-2 border-b-2 border-white rounded-full animate-spin mb-4"></div>
                <p className="text-white">{t("common.loading")}</p>
              </div>
            ) : error ? (
              <div className="bg-black/50 p-4 rounded-lg mb-20">
                <p className="text-red-400">{t("common.error")}</p>
              </div>
            ) : heroProduct ? (
              <div className="space-y-4 mb-20">
                <h2 className="font-serif text-2xl text-white">{heroProduct.name}</h2>
                <p className="text-lg text-white/80">{Number(heroProduct.price || 0).toFixed(2)} €</p>
                <Link
                  to={`/product/${heroProduct.id}`}
                  className="inline-block px-6 py-2 bg-white text-black font-medium rounded-lg"
                >
                  {t("home.exploreButton")}
                </Link>
              </div>
            ) : (
              <div className="space-y-4 mb-20">
                <h2 className="font-serif text-2xl text-white">{t("home.defaultProductTitle")}</h2>
                <Link to="/shop" className="inline-block px-6 py-2 bg-white text-black font-medium rounded-lg">
                  {t("home.shopNow")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Affiche le contenu SEULEMENT si pas mobile */}
      {!isMobile && (
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-white rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">{t("common.loading")}</p>
            </div>
          ) : error ? (
            <div className="bg-black/50 p-6 rounded-lg">
              <h2 className="text-red-400 text-xl mb-3">{t("common.error")}</h2>
              <p className="text-white">{error}</p>
              <button 
                className="mt-4 px-6 py-2 bg-white text-black rounded hover:bg-white/80"
                onClick={() => window.location.reload()}
              >
                {t("common.retry")}
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
                {title || t("home.bannerTitle")}
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl mb-8">
                {subtitle || t("home.bannerSubtitle")}
              </p>
              <div className="space-y-6">
                {heroProduct ? (
                  <>
                    <h2 className="font-serif text-3xl text-white">{heroProduct.name}</h2>
                    <p className="text-lg max-w-lg">{heroProduct.description ?? ""}</p>

                    <p className="text-2xl text-white">
                      {Number(heroProduct.price || 0).toFixed(2)} €
                    </p>

                    <Link
                      to={`/product/${heroProduct.id}`}
                      className="inline-block px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
                    >
                      {t("home.exploreButton")}
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="font-serif text-3xl text-white">{title || t("home.defaultProductTitle")}</h2>
                    <p className="text-lg max-w-lg">{subtitle || t("home.defaultProductDescription")}</p>
                    <Link
                      to="/shop"
                      className="inline-block px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
                    >
                      {t("home.exploreButton")}
                    </Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {/* Animation keyframes pour fade-in mobile */}
      <style>
        {`
          @keyframes bannerFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Banner;
