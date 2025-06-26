import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Images from "../components/productDetail/images";
import Details from "../components/productDetail/details";
import SeeAlso from "../components/productDetail/seeAlso";
import Toast from "../components/common/Toast";
import Description from "../components/productDetail/description";

// Données des produits (simulant une API)
const productsData = [
  {
    id: 1,
    name: "Sogno Intenso",
    description:
      "Notre parfum signature aux notes d'ambre, de vanille et de bois de santal. Cette fragrance captivante enveloppe celui qui la porte d'une aura chaude et sensuelle qui dure toute la journée. Parfait pour les soirées et les occasions spéciales.",
    fullDescription: `
      <p>Sogno Intenso, notre parfum phare, représente l'apogée de la parfumerie italienne. Créé par le maître parfumeur Alessandro Gualtieri, ce parfum captivant raconte une histoire de luxe et de sophistication.</p>
      <p>Le voyage commence par des notes de tête de bergamote et de poivre noir, s'ouvrant sur un cœur d'ambre riche et de vanille. Les notes de fond de bois de santal, de musc et de patchouli apportent profondeur et longévité, garantissant que le parfum évolue magnifiquement tout au long de la journée.</p>
      <p>Chaque flacon est façonné à la main et rempli dans notre atelier à Florence, garantissant la plus haute qualité et le souci du détail.</p>
    `,
    price: 149.99,
    images: ["/perfums.jpg", "/perfum1.jpg", "/perfum2.jpg"],
    size: "100ml",
    ingredients:
      "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Salicylate, Linalool, Limonene, Coumarin, Citral, Citronellol, Geraniol, Eugenol",
    category: "oriental",
  },
  // Ajoutez d'autres produits au besoin...
];

// Produits fictifs similaires pour la démo
const relatedProductsDemo = [
  {
    id: 2,
    name: "Luna Dorata",
    description: "Mélange floral et d'agrumes avec des notes boisées.",
    price: 129.99,
    images: ["/perfum1.jpg"],
    category: "floral",
  },
  {
    id: 3,
    name: "Notte Stellata",
    description: "Un mélange luxueux d'épices exotiques et de musc.",
    price: 139.99,
    images: ["/perfum2.jpg"],
    category: "oriental",
  },
  {
    id: 4,
    name: "Velluto Nero",
    description: "Profond et mystérieux avec des notes de oud et de patchouli.",
    price: 159.99,
    images: ["/perfum3.jpg"],
    category: "woody",
  },
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Effet pour charger le produit
  useEffect(() => {
    // Simuler la récupération API avec un court délai
    const timer = setTimeout(() => {
      const foundProduct = productsData.find((p) => p.id === Number(id));
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  // Effet pour animer les images en boucle
  useEffect(() => {
    if (product?.images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
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
    setToastMessage(
      "Le système de paiement PayPal est actuellement en maintenance. Veuillez passer par WhatsApp."
    );
    setShowToast(true);
  };

  // Gestion du toast pour Ajouter au panier
  const handleAddToCart = () => {
    setToastMessage(
      "Le système de paiement n'est actuellement pas disponible. Veuillez nous contacter via WhatsApp."
    );
    setShowToast(true);
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
          Retour à la boutique
        </Link>

        {loading && (
          <motion.div
            className="min-h-screen bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-white text-2xl">Chargement...</div>
          </motion.div>
        )}

        {!product && (
          <motion.div
            className="min-h-screen bg-black py-12 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl font-serif text-white mb-4">
                Produit non trouvé
              </h2>
              <p className="text-white mb-8">
                Nous n'avons pas pu trouver le parfum que vous recherchez.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-md transition-colors duration-300"
              >
                Retour à la boutique
              </button>
            </div>
          </motion.div>
        )}

        {product && (
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
        )}

        {product && (
          <Description
            description={product.description}
            ingredientsDescription={product.ingredients}
          />
        )}

        {/* Composant SeeAlso */}
        <SeeAlso relatedProducts={relatedProductsDemo} />
      </div>
    </motion.div>
  );
};

export default ProductDetail;
