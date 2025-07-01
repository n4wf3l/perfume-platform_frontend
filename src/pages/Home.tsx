import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Banner from "../components/home/banner";
import ProductCard from "../components/home/productCard";
import TwoCovers from "../components/home/twoCovers";
import NewPerfums from "../components/home/newPerfums";
import Header from "../components/Header";

// Mock featured product data
const featuredProduct = {
  id: 1,
  name: "Sogno Intenso",
  description:
    "Notre parfum signature aux notes d'ambre, de vanille et de bois de santal.",
  price: 149.99,
  images: ["/perfums.jpg"],
};

// Mock featured products data
const featuredProducts = [
  {
    id: 2,
    name: "Luna Dorata",
    description: "Mélange floral et d'agrumes avec des notes boisées.",
    price: 129.99,
    images: ["/perfum1.jpg"],
  },
  {
    id: 3,
    name: "Notte Stellata",
    description: "Un mélange luxueux d'épices exotiques et de musc.",
    price: 139.99,
    images: ["/perfum2.jpg"],
  },
  {
    id: 4,
    name: "Velluto Nero",
    description: "Profond et mystérieux avec des notes de oud et de patchouli.",
    price: 159.99,
    images: ["/perfum3.jpg"],
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const productsRef = useRef(null);
  const collectionRef = useRef(null);

  const productsInView = useInView(productsRef, {
    once: true,
    margin: "-100px",
  });
  const collectionInView = useInView(collectionRef, {
    once: true,
    margin: "-100px",
  });

  // Gère le responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handlers boutons
  const goToWomen = () => navigate("/shop?gender=femme");
  const goToMen = () => navigate("/shop?gender=homme");

  return (
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
            <Banner product={featuredProduct} title="" subtitle="" />
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
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Il profumo dei tuoi sogni
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
          <Banner
            product={featuredProduct}
            title={t("home.bannerTitle")}
            subtitle={t("home.bannerSubtitle")}
          />
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
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Section TwoCovers */}
      <TwoCovers />

      {/* Nouveaux Parfums Section */}
      <NewPerfums />
    </motion.div>
  );
};

export default Home;
