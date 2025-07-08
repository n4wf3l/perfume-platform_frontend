import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet"; // Ajouter cette ligne
import Banner from "../components/home/banner";
import ProductCard from "../components/home/productCard";
import NewPerfums from "../components/home/newPerfums";
import TwoCovers from "../components/home/twoCovers";
import Header from "../components/Header";
import productService from "../services/productService";
import type { Product } from "../types/api";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ITALIAN_QUOTE = "Il profumo dei tuoi sogni";

const Home: React.FC = () => {
  // Note: The heroProduct state is handled directly in the Banner component now
  const [flagshipProducts, setFlagshipProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation();
  const productsRef = useRef(null);
  const collectionRef = useRef(null);
  const [typed, setTyped] = useState("");

  const productsInView = useInView(productsRef, {
    once: true,
    margin: "-100px",
  });
  const collectionInView = useInView(collectionRef, {
    once: true,
    margin: "-100px",
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Get flagship products (is_flagship = true)
        const flagships = await productService.getFlagshipProducts();
        setFlagshipProducts(flagships.slice(0, 3)); // Limit to 3 products
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Une erreur est survenue lors du chargement des produits.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    setTyped("");
    let i = 0;
    const interval = setInterval(() => {
      setTyped(ITALIAN_QUOTE.slice(0, i + 1));
      i++;
      if (i === ITALIAN_QUOTE.length) clearInterval(interval);
    }, 55); // vitesse d'écriture
    return () => clearInterval(interval);
  }, [isMobile]);

  // Handlers boutons
  const navigate = useNavigate();
  const goToWomen = () => navigate("/shop?gender=femme");
  const goToMen = () => navigate("/shop?gender=homme");

  return (
    <>
      {/* Ajout des balises meta SEO */}
      <Helmet>
        <title>SOGNO D'ORO® | Belgian Luxury Perfums</title>
        <meta
          name="description"
          content="Découvrez SOGNO D'ORO, marque belge de parfums de luxe. Explorez notre collection exclusive de fragrances pour femme et homme qui racontent votre histoire."
        />

        {/* Liens canoniques et alternates */}
        <link rel="canonical" href="https://www.sognodoro.be" />

        {/* Open Graph Tags pour Facebook/Instagram */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SOGNO D'ORO | Parfums de Luxe Belges"
        />
        <meta
          property="og:description"
          content="Des parfums qui racontent votre histoire. Collection exclusive de fragrances de luxe."
        />
        <meta property="og:url" content="https://www.sognodoro.be" />
        <meta property="og:image" content="https://www.sognodoro.be/logo.png" />
        <meta property="og:site_name" content="SOGNO D'ORO" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="SOGNO D'ORO | Parfums de Luxe Belges"
        />
        <meta
          name="twitter:description"
          content="Des parfums qui racontent votre histoire. Collection exclusive de fragrances de luxe."
        />
        <meta
          name="twitter:image"
          content="https://www.sognodoro.be/logo.png"
        />

        {/* Social Media */}
        <meta name="instagram:creator" content="@sogno.doro_profumo" />
        <meta name="snapchat:creator" content="@sogno-doro" />

        {/* Structured Data en JSON-LD */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Brand",
              "name": "SOGNO D'ORO",
              "description": "Parfums de luxe belges pour femme et homme",
              "url": "https://www.sognodoro.be",
              "logo": "https://www.sognodoro.be/logo.png",
              "sameAs": [
                "https://www.instagram.com/sogno.doro_profumo",
                "https://snapchat.com/add/sogno-doro"
              ]
            }
          `}
        </script>
      </Helmet>

      <motion.div
        className="min-h-screen bg-black text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Mobile (cover + boutons) */}
        {isMobile ? (
          <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
            {/* Banner cover en fond */}
            <div className="absolute inset-0 z-0">
              <Banner />
            </div>
            {/* Overlay noir pour foncer la cover */}
            <div className="absolute inset-0 bg-black/60 z-10" />
            {/* Hero mobile */}
            <div className="relative z-20 flex flex-col items-center justify-center min-h-screen pt-24 pb-12">
              <motion.h1
                className="font-serif text-5xl mb-8 text-center"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Sogno D'Oro
              </motion.h1>
              {/* Slogan italien sous le titre */}
              <motion.p
                className="mb-6 text-2xl text-white"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textShadow: "0 1px 8px rgba(0,0,0,0.25)",
                  minHeight: "2.5rem", // évite le saut de layout
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {typed}
              </motion.p>
              <motion.div
                className="flex items-center justify-center mb-10 w-full"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Ligne gauche */}
                <motion.div
                  className="h-0.5 bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                  style={{ marginRight: 16 }}
                />
                {/* Texte */}
                <span className="text-lg font-semibold tracking-widest uppercase whitespace-nowrap">
                  {t("home.offerIt") || "Offrez-le"}
                </span>
                {/* Ligne droite */}
                <motion.div
                  className="h-0.5 bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                  style={{ marginLeft: 16 }}
                />
              </motion.div>
              <motion.div
                className="flex flex-col gap-6 w-full px-8"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.button
                  className="w-full py-4 rounded-full bg-white text-black font-semibold text-lg shadow-lg uppercase"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goToWomen}
                >
                  {t("home.forHer")?.toUpperCase() || "POUR ELLE"}
                </motion.button>
                <motion.button
                  className="w-full py-4 rounded-full bg-white text-black font-semibold text-lg shadow-lg uppercase"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goToMen}
                >
                  {t("home.forHim")?.toUpperCase() || "POUR LUI"}
                </motion.button>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.section
            className="w-full relative mb-8 md:mb-12"
            style={{
              minHeight: "480px",
              height: "auto",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Banner />
          </motion.section>
        )}

        {/* Header mobile toujours affiché */}
        {isMobile && (
          <div className="fixed top-0 left-0 w-full z-50">
            <Header />
          </div>
        )}

        {/* Featured Products Section */}
        <section className="py-10 mb-16 w-full" ref={productsRef}>
          <motion.div
            className="max-w-7xl mx-auto px-5"
            initial="hidden"
            animate={productsInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.3,
                },
              },
            }}
          >
            <motion.h2
              className="font-serif text-4xl text-white text-center mb-3"
              variants={fadeIn}
              transition={{ duration: 0.6 }}
            >
              {t("home.featuredProducts")}
            </motion.h2>

            <motion.div
              className="w-24 h-0.5 bg-white mx-auto mb-8"
              variants={{
                hidden: { width: 0 },
                visible: { width: "6rem" },
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>

            <motion.p
              className="text-center max-w-2xl mx-auto mb-10 leading-relaxed text-lg"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t("home.featuredDescription")}
            </motion.p>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {loading ? (
                // Display loading placeholders
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <motion.div
                      key={index}
                      variants={fadeIn}
                      className="bg-gray-800/50 rounded-lg h-96 animate-pulse"
                    />
                  ))
              ) : error ? (
                <div className="col-span-3 text-center py-10">
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-white text-black rounded-md"
                  >
                    Réessayer
                  </button>
                </div>
              ) : flagshipProducts.length > 0 ? (
                flagshipProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={fadeIn}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p>Aucun produit phare n'est disponible pour le moment.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </section>

        {/* Section TwoCovers */}
        <TwoCovers />

        {/* Nouveaux Parfums Section */}
        <NewPerfums />
      </motion.div>
    </>
  );
};

export default Home;
