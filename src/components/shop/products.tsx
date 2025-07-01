import React from "react";
import { motion } from "framer-motion";
import ProductCard from "../home/productCard";
import { useTranslation } from "react-i18next"; // Ajout import

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
}

interface ProductsProps {
  products: Product[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  productsPerPage: number;
  totalProducts: number;
}

const Products: React.FC<ProductsProps> = ({
  products,
  currentPage,
  setCurrentPage,
  productsPerPage,
  totalProducts,
}) => {
  const { t } = useTranslation(); // Ajout hook
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {products.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12 bg-black rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xl text-gray-400">{t("shop.noResults")}</p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalProducts > productsPerPage && (
        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-l-md border border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border-t border-b border-r border-gray-700 ${
                  currentPage === page
                    ? "bg-white text-black"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-r-md border border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &raquo;
            </button>
          </nav>
        </motion.div>
      )}
    </>
  );
};

export default Products;
