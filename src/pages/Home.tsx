import React, { useEffect, useState } from "react";
import Banner from "../components/home/banner";
import ProductCard from "../components/home/productCard";
import NewPerfums from "../components/home/newPerfums";
import TwoCovers from "../components/home/twoCovers";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next"; // Ajout import

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
  const [isLoaded, setIsLoaded] = useState(false);
  const productsRef = useRef(null);
  const collectionRef = useRef(null);
  const { t } = useTranslation(); // Ajout hook

  const productsInView = useInView(productsRef, {
    once: true,
    margin: "-100px",
  });
  const collectionInView = useInView(collectionRef, {
    once: true,
    margin: "-100px",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-black text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.section
        className="w-full h-screen relative mb-16"
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
