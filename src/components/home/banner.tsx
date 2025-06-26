import React from "react";
import { Link } from "react-router-dom";

// Définir l'image par défaut avec un chemin absolu
const defaultBgImage = "/perfums.jpg"; // Doit être dans le dossier public

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface BannerProps {
  product: Product;
  title: string;
  subtitle: string;
}

const Banner: React.FC<BannerProps> = ({ product, title, subtitle }) => {
  // Utiliser l'image importée comme fallback
  const backgroundImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : defaultBgImage;

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Background image avec animation */}
      <div
        className="absolute inset-0 bg-cover bg-center w-full h-full animate-subtle-pulse"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4)", // Fond plus sombre
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
        <h1 className="font-serif text-5xl md:text-7xl text-white mb-4">
          {title}
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8">{subtitle}</p>
        <div className="space-y-6">
          <h2 className="font-serif text-3xl text-white">{product.name}</h2>
          <p className="text-lg max-w-lg">{product.description}</p>
          <p className="text-2xl text-white">{product.price.toFixed(2)} €</p>
          <Link
            to={`/product/${product.id}`}
            className="inline-block px-8 py-3 bg-white hover:bg-white/90 text-black font-medium rounded transition-colors duration-300"
          >
            Découvrir
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
