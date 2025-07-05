import React from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/api";


import { useTranslation } from "react-i18next";

// Définir l'image par défaut avec un chemin absolu
const defaultBgImage = "/perfums.jpg"; // Doit être dans le dossier public

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

interface BannerProps {
  product: Product;
  title: string;
  subtitle: string;
}

const Banner: React.FC<BannerProps> = ({ product, title, subtitle }) => {
  const { t } = useTranslation();

  // Utiliser l'image importée comme fallback
  const backgroundImage =
    product.images && product.images.length > 0
      ? `${IMAGE_URL}/${product.images[0].path}`
      : defaultBgImage;

  // Détection mobile simple
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            // ↓↓↓ Moins opaque qu'avant
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      )}
      {/* Affiche le contenu SEULEMENT si pas mobile */}
      {!isMobile && (
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
            {t("home.bannerTitle")}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8">
            {t("home.bannerSubtitle")}
          </p>
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-white">{product.name}</h2>
            <p className="text-lg max-w-lg">{product.description ?? ""}</p>

            <p className="text-2xl text-white">
            {Number(product.price || 0).toFixed(2)} €
          </p>

            <Link
              to={`/product/${product.id}`}
              className="inline-block px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
            >
              {t("home.exploreButton")}
            </Link>
          </div>
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
