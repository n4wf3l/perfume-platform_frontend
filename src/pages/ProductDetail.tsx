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
  const { t } = useTranslation(); // Ajout hook
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Effet pour charger le produit
  useEffect(() => {
    setLoading(true);
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
    setToastMessage(t("product.paypalMaintenance"));
    setShowToast(true);
  };

  // Gestion du toast pour Ajouter au panier
  const handleAddToCart = () => {
    setToastMessage(t("product.cartUnavailable"));
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

            <Description
              description={product.description}
              ingredientsDescription={product.ingredients}
            />

            {/* Composant SeeAlso */}
            <SeeAlso relatedProducts={relatedProductsDemo} />

            <div className="mt-16">
              <h3 className="text-2xl font-serif text-white mb-6">
                Vous aimerez aussi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProductsDemo.map((product, idx) => {
                  const isMobile =
                    typeof window !== "undefined" && window.innerWidth < 768;
                  const variants = isMobile
                    ? {
                        hidden: { opacity: 0, x: idx % 2 === 0 ? -80 : 80 },
                        visible: { opacity: 1, x: 0 },
                      }
                    : {
                        hidden: { opacity: 0, y: 40 },
                        visible: { opacity: 1, y: 0 },
                      };

                  return (
                    <motion.div
                      key={product.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={variants}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      className="bg-gray-900 rounded-xl p-6 flex flex-col items-center"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg mb-4"
                      />
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {product.name}
                      </h4>
                      <p className="text-gray-300 mb-2">
                        {product.description}
                      </p>
                      <span className="text-white font-bold">
                        {product.price} €
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetail;
