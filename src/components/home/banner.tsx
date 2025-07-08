import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../../types/api";
import productService from "../../services/productService";
import { useTranslation } from "react-i18next";

// Définir l'image par défaut avec un chemin absolu
const defaultBgImage = "/perfums.jpg";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultTitle = "Collection Exclusive";
const defaultSubtitle = "Des parfums qui vous transportent ailleurs";

interface BannerProps {
  title?: string;
  subtitle?: string;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mise à jour du fetch pour gérer l'animation
  useEffect(() => {
    const fetchHeroProduct = async () => {
      try {
        // Commencer avec l'image par défaut, ne pas montrer de chargement
        const cachedProducts = localStorage.getItem("heroProducts");

        // Si nous avons des données en cache, les utiliser immédiatement
        if (cachedProducts) {
          try {
            const parsedProducts = JSON.parse(cachedProducts);
            if (parsedProducts && parsedProducts.length > 0) {
              setHeroProduct(parsedProducts[0]);
              // Délai court pour montrer l'animation même avec cache
              setTimeout(() => setDataLoaded(true), 100);
            }
          } catch (e) {
            console.error("Erreur parsing cache:", e);
          }
        }

        // Ensuite faire la requête API normalement
        const heroProducts = await productService.getHeroProducts();

        if (
          heroProducts &&
          Array.isArray(heroProducts) &&
          heroProducts.length > 0
        ) {
          setHeroProduct(heroProducts[0]);
          localStorage.setItem("heroProducts", JSON.stringify(heroProducts));
          setDataLoaded(true); // Activer l'animation
          return;
        }

        // Si pas de produit héros, tenter avec tous les produits
        const allProducts = await productService.getAllProducts();
        if (
          allProducts &&
          Array.isArray(allProducts) &&
          allProducts.length > 0
        ) {
          const heroProduct =
            allProducts.find((p) => p.is_hero) || allProducts[0];
          setHeroProduct(heroProduct);
          localStorage.setItem("heroProducts", JSON.stringify([heroProduct]));
          setDataLoaded(true); // Activer l'animation
        }
      } catch (err) {
        console.error("Failed to fetch hero product:", err);
      }
    };

    fetchHeroProduct();
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Background images avec transition douce */}
      <div className="absolute inset-0">
        {/* Image par défaut (toujours visible au début) */}
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full"
          style={{
            backgroundImage: `url(${defaultBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: isMobile ? "brightness(0.7)" : "brightness(0.4)",
          }}
        />

        {/* Image du produit (avec animation à l'apparition) */}
        <AnimatePresence>
          {dataLoaded &&
            heroProduct?.images &&
            heroProduct.images.length > 0 && (
              <motion.div
                key={`image-${heroProduct.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center w-full h-full"
                style={{
                  backgroundImage: `url(${IMAGE_URL}/${heroProduct.images[0].path})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: isMobile ? "brightness(0.7)" : "brightness(0.4)",
                }}
              />
            )}
        </AnimatePresence>
      </div>

      {/* Dégradé overlay pour mobile */}
      {isMobile && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.65) 100%)",
          }}
        >
          {/* Espace vide - aucun texte en mobile */}
          <div className="h-full flex flex-col justify-center items-center">
            {/* Tout le contenu a été retiré */}
          </div>
        </div>
      )}

      {/* Affiche le contenu desktop */}
      {!isMobile && (
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
            {title || t("home.bannerTitle", "Parfums de Luxe")}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8">
            {subtitle ||
              t(
                "home.bannerSubtitle",
                "Découvrez des parfums qui racontent votre histoire"
              )}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              className="space-y-6"
              key={heroProduct?.id || "default"}
              initial={{ opacity: 0 }}
              animate={{ opacity: dataLoaded ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            >
              {heroProduct ? (
                <>
                  <motion.h2
                    className="font-serif text-3xl text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: dataLoaded ? 1 : 0,
                      y: dataLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {heroProduct.name}
                  </motion.h2>
                  <motion.p
                    className="text-lg max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: dataLoaded ? 1 : 0,
                      y: dataLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {heroProduct.description || ""}
                  </motion.p>
                  <motion.p
                    className="text-2xl text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: dataLoaded ? 1 : 0,
                      y: dataLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {Number(heroProduct.price || 0).toFixed(2)} €
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: dataLoaded ? 1 : 0,
                      y: dataLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Link
                      to={`/product/${heroProduct.id}`}
                      className="inline-block px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
                    >
                      {t("home.exploreButton", "Explorer")}
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.h2
                    className="font-serif text-3xl text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: dataLoaded ? 1 : 0,
                      y: dataLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {defaultTitle}
                  </motion.h2>
                  <motion.p
                    className="text-lg max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: dataLoaded ? 1 : 0,
                      y: dataLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {defaultSubtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: dataLoaded ? 1 : 0,
                      y: dataLoaded ? 0 : 20,
                    }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Link
                      to="/shop"
                      className="inline-block px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
                    >
                      {t("home.exploreButton", "Explorer")}
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Banner;
