import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// Import des composants du dashboard
import ViewProducts from "./viewProducts";
import AddProducts from "./addProducts";
import EditProducts from "./editProducts";
import ViewCategory from "./viewCategory";
import AddCategory from "./addCategory";
import EditCategory from "./editCategory";
import ViewOrders from "./viewOrders";
// Importer le composant Statistics
import Statistics from "./statistics";
import KanbanOrders from "./kanbanOrders";

// Import services
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import categoryService from "../../services/categoryService";

interface DashboardProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

interface StatItem {
  title: string;
  value: string;
  change?: string;
  status?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  link: string;
}

const DashboardComponent: React.FC<DashboardProps> = ({
  sidebarOpen,
  toggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<StatItem[]>([]);

  // Animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    }),
  };

  // Icons for stats cards
  const orderIcon = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      ></path>
    </svg>
  );

  const productIcon = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      ></path>
    </svg>
  );

  const categoryIcon = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      ></path>
    </svg>
  );

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch data in parallel for better performance
        const [products, orders, categories] = await Promise.all([
          productService.getAllProducts(),
          orderService.getAllOrders(),
          categoryService.getAllCategories(),
        ]);

        // Prepare stats data with actual counts
        const dashboardStats: StatItem[] = [
          {
            title: "Commandes",
            value: orders.length.toString(),
            change: "Mis à jour",
            status: "up",
            icon: orderIcon,
            link: "/dashboard/orders",
          },
          {
            title: "Produits",
            value: products.length.toString(),
            change: "Mis à jour",
            status: "up",
            icon: productIcon,
            link: "/dashboard/products",
          },
          {
            title: "Catégories",
            value: categories.length.toString(),
            change: "Mis à jour",
            status: "neutral",
            icon: categoryIcon,
            link: "/dashboard/categories",
          },
        ];

        setStats(dashboardStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default stats in case of error
        setStats([
          {
            title: "Commandes",
            value: "0",
            change: "Erreur",
            status: "neutral",
            icon: orderIcon,
            link: "/dashboard/orders",
          },
          {
            title: "Produits",
            value: "0",
            change: "Erreur",
            status: "neutral",
            icon: productIcon,
            link: "/dashboard/products",
          },
          {
            title: "Catégories",
            value: "0",
            change: "Erreur",
            status: "neutral",
            icon: categoryIcon,
            link: "/dashboard/categories",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fonction pour vérifier si nous sommes sur la route principale
  const isMainDashboard = location.pathname === "/dashboard";

  return (
    <div className="bg-black min-h-screen">
      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-gray-900 border-b border-[#d4af37]/20 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 text-gray-400 hover:text-[#d4af37] focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <h1 className="text-xl font-serif text-[#d4af37]">
              {isMainDashboard
                ? "Tableau de bord"
                : location.pathname.includes("/products/add")
                ? "Ajouter un produit"
                : location.pathname.includes("/products/edit")
                ? "Modifier un produit"
                : location.pathname.includes("/products")
                ? "Gestion des produits"
                : location.pathname.includes("/categories/add")
                ? "Ajouter une catégorie"
                : location.pathname.includes("/categories/edit")
                ? "Modifier une catégorie"
                : location.pathname.includes("/categories")
                ? "Gestion des catégories"
                : location.pathname.includes("/orders")
                ? "Gestion des commandes"
                : "Tableau de bord"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-[#d4af37] focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-[#d4af37] focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <motion.div
          className="p-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Routes>
            {/* Page d'accueil du Dashboard */}
            <Route
              path="/"
              element={
                <>
                  {/* Stats Cards */}
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {[1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className="bg-gray-900 border border-[#d4af37]/10 rounded-xl p-6 shadow-lg shadow-[#d4af37]/5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[#d4af37] opacity-50">
                              <div className="w-6 h-6 rounded-full animate-pulse bg-gray-700" />
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-gray-400 animate-pulse">
                              Chargement...
                            </span>
                          </div>
                          <div className="mt-4">
                            <div className="h-4 bg-gray-800 rounded animate-pulse mb-2 w-20" />
                            <div className="h-8 bg-gray-800 rounded animate-pulse w-12" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.title}
                          onClick={() => navigate(stat.link)}
                          variants={cardVariants}
                          custom={index}
                          className="bg-gray-900 border border-[#d4af37]/10 rounded-xl p-6 shadow-lg shadow-[#d4af37]/5 cursor-pointer"
                          whileHover={{
                            y: -5,
                            boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.1)",
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[#d4af37]">{stat.icon}</span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                stat.status === "up"
                                  ? "bg-green-900/30 text-green-400"
                                  : stat.status === "down"
                                  ? "bg-red-900/30 text-red-400"
                                  : "bg-yellow-900/30 text-yellow-400"
                              }`}
                            >
                              {stat.status === "up" ? (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 15l7-7 7 7"
                                  ></path>
                                </svg>
                              ) : stat.status === "down" ? (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  ></path>
                                </svg>
                              ) : (
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                  ></path>
                                </svg>
                              )}
                              {stat.change}
                            </span>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-gray-400 text-sm font-medium">
                              {stat.title}
                            </h3>
                            <p className="text-gray-100 text-2xl font-semibold mt-1">
                              {stat.value}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      onClick={() => navigate("/dashboard/products/add")}
                      className="bg-gray-900 border border-[#d4af37]/10 rounded-xl p-6 flex items-center cursor-pointer"
                      variants={cardVariants}
                      custom={7}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.1)",
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mr-4">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-gray-200 text-sm font-medium">
                          Ajouter un produit
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          Créer une nouvelle fiche produit
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      onClick={() => navigate("/dashboard/categories/add")}
                      className="bg-gray-900 border border-[#d4af37]/10 rounded-xl p-6 flex items-center cursor-pointer"
                      variants={cardVariants}
                      custom={8}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.1)",
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mr-4">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-gray-200 text-sm font-medium">
                          Ajouter une catégorie
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          Créer une nouvelle catégorie de produit
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      onClick={() => navigate("/dashboard/orders")}
                      className="bg-gray-900 border border-[#d4af37]/10 rounded-xl p-6 flex items-center cursor-pointer"
                      variants={cardVariants}
                      custom={9}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.1)",
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mr-4">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-gray-200 text-sm font-medium">
                          Voir les commandes
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          Gérer et suivre les commandes clients
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Ajouter le composant Statistics ici */}
                  <motion.div
                    className="mt-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                  >
                    <h2 className="text-xl font-serif text-[#d4af37] mb-6">
                      Statistiques Détaillées
                    </h2>
                    <Statistics />
                  </motion.div>
                </>
              }
            />

            {/* Routes pour les produits */}
            <Route path="/products" element={<ViewProducts />} />
            <Route path="/products/add" element={<AddProducts />} />
            <Route path="/products/edit/:id" element={<EditProducts />} />

            {/* Routes pour les catégories */}
            <Route path="/categories" element={<ViewCategory />} />
            <Route path="/categories/add" element={<AddCategory />} />
            <Route path="/categories/edit/:id" element={<EditCategory />} />

            {/* Route pour les commandes */}
            <Route path="/orders" element={<ViewOrders />} />
            <Route path="/orders/kanban" element={<KanbanOrders />} />
          </Routes>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardComponent;
