import React, { useEffect, useState } from "react";
import Banner from "../components/home/banner";
import ProductCard from "../components/home/productCard";
import NewPerfums from "../components/home/newPerfums";
import TwoCovers from "../components/home/twoCovers";
import productService from "../services/productService";
import type { Product } from "../types/api";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  const [heroProduct, setHeroProduct] = useState<Product | null>(null);
  const [flagshipProducts, setFlagshipProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Get hero products (is_hero = true)
        const heroes = await productService.getHeroProducts();
        if (heroes.length > 0) {
          setHeroProduct(heroes[0]); // Use the first hero product
        }
        
        // Get flagship products (is_flagship = true)
        const flagships = await productService.getFlagshipProducts();
        setFlagshipProducts(flagships.slice(0, 3)); // Limit to 3 products
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Une erreur est survenue lors du chargement des produits.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
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
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="text-white text-2xl">Chargement...</div>
          </div>
        ) : heroProduct ? (
          <Banner
            product={heroProduct}
            title="Parfums de Luxe"
            subtitle="Découvrez des fragrances qui racontent votre histoire"
          />
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-screen">
            <div className="text-white text-2xl mb-4">Impossible de charger le produit vedette</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black rounded-md"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="text-white text-2xl">Aucun produit vedette disponible</div>
          </div>
        )}

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
            Produits Phares
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
            Explorez nos parfums les plus populaires, élaborés avec les
            meilleurs ingrédients.
          </motion.p>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {loading ? (
              // Display loading placeholders
              Array(3).fill(0).map((_, index) => (
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

      {/* Section TwoCovers - Ajoutée ici entre productCard et newPerfums */}
      <TwoCovers />

      {/* Nouveaux Parfums Section */}
      <NewPerfums />
    </motion.div>
  );
};

export default Home;
