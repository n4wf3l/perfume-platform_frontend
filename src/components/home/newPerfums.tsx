import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProductCard from "./productCard";
import productService from "../../services/productService";
import type { Product } from "../../types/api";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface NewPerfumsProps {
  title?: string;
  subtitle?: string;
}

const NewPerfums: React.FC<NewPerfumsProps> = ({
  title = "Nouveaux parfums",
  subtitle = "Découvrez nos créations les plus récentes, alliant innovation et tradition.",
}) => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        // Get all products and sort by creation date, newest first
        const products = await productService.getAllProducts();
        const sorted = products
          .sort((a, b) => {
            // Sort by creation date, newest first
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 3); // Get only the 3 newest products
        
        setNewProducts(sorted);
      } catch (err) {
        console.error('Error fetching new products:', err);
        setError('Une erreur est survenue lors du chargement des produits.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewProducts();
  }, []);

  return (
    <div ref={sectionRef} className="py-10 mb-16 w-full">
      <motion.div
        className="max-w-7xl mx-auto px-5"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
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
          {title}
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
          {subtitle}
        </motion.p>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : newProducts.length === 0 ? (
          <div className="text-center text-gray-300 py-8">Aucun nouveau parfum pour le moment.</div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {newProducts.map((product, index) => (
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
        )}
      </motion.div>
    </div>
  );
};

export default NewPerfums;
