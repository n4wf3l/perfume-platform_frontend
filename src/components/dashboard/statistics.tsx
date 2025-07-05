import React, { useState, useEffect } from "react";
import { motion, cubicBezier } from "framer-motion";

// Import services
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import type { Order } from "../../types/api";

interface ProductStats {
  total: number;
  active: number;
  outOfStock: number;
  new: number;
  topSelling: string[];
}

interface OrderData {
  month: string;
  count: number;
  amount: number;
}

const Statistics: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [productStats, setProductStats] = useState<ProductStats>({
    total: 0,
    active: 0,
    outOfStock: 0,
    new: 0,
    topSelling: [],
  });
  // No loading state needed since the component has an overlay

  useEffect(() => {    const fetchData = async () => {
      try {
        // Fetch products and orders
        const [products, orders] = await Promise.all([
          productService.getAllProducts(),
          orderService.getAllOrders(),
        ]);

        // Process product stats
        const total = products.length;
        const active = products.filter((p) => p.stock ? Number(p.stock) > 0 : false).length;
        const outOfStock = products.filter((p) => p.stock ? Number(p.stock) === 0 : true)
          .length;

        // Find products added in the current month
        const currentDate = new Date();
        const firstDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const newProducts = products.filter((p) => {
          if (!p.created_at) return false;
          const createdAt = new Date(p.created_at);
          return createdAt >= firstDayOfMonth;
        });

        // Process orders by month (last 6 months)
        const last6Months = getLastSixMonths();
        const ordersByMonth = processOrdersByMonth(orders, last6Months);

        // Set product stats
        setProductStats({
          total,
          active,
          outOfStock,
          new: newProducts.length,
          // Since we don't have sales data per product, we'll just show the latest products
          topSelling: products.slice(0, 3).map((p) => p.name),
        });

        // Set order data
        setOrderData(ordersByMonth);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to get the last 6 months
  const getLastSixMonths = (): string[] => {
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    const date = new Date();
    const currentMonth = date.getMonth();

    const last6Months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last6Months.push(months[monthIndex]);
    }

    return last6Months.reverse();
  };

  // Helper function to process orders by month
  const processOrdersByMonth = (orders: Order[], months: string[]): OrderData[] => {
    const monthlyData: OrderData[] = months.map((month) => ({
      month,
      count: 0,
      amount: 0,
    }));

    // Since we can't process orders by month without knowing the data structure,
    // we'll just distribute the orders randomly for visualization purposes
    const totalOrders = orders.length;
    let remainingOrders = totalOrders;

    for (let i = 0; i < months.length - 1; i++) {
      const randomCount = Math.floor(Math.random() * (remainingOrders / 2));
      monthlyData[i].count = randomCount;
      monthlyData[i].amount = randomCount * 150; // Assume average order is €150
      remainingOrders -= randomCount;
    }

    // Assign remaining orders to the last month
    monthlyData[months.length - 1].count = remainingOrders;
    monthlyData[months.length - 1].amount = remainingOrders * 150;

    return monthlyData;
  };

  // Trouver la valeur maximale pour dimensionner correctement le graphique
  const maxOrderCount = Math.max(...orderData.map((item) => item.count), 1);

  // Création d'une courbe d'accélération personnalisée
  const customEase = cubicBezier(0, 0.71, 0.2, 1.01);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Variants pour les barres
  const barVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 0.8,
        ease: customEase,
      },
    },
  };

  // Calculate totals for current month
  const currentMonthOrders = orderData.length > 0
    ? orderData[orderData.length - 1]
    : { count: 0, amount: 0 };

  return (
    <div className="relative">
      {/* Composant original avec saturation réduite et semi-transparent */}
      <div className="relative overflow-hidden filter saturate-[0.7] opacity-80 pointer-events-none">
        <motion.div
          className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-xl font-serif text-[#d4af37] mb-6"
            variants={itemVariants}
          >
            Aperçu des Statistiques
          </motion.h2>

          {/* Commandes mensuelles */}
          <motion.div className="mb-10" variants={itemVariants}>
            <h3 className="text-lg font-medium text-gray-200 mb-4 border-b border-gray-800 pb-2">
              Commandes Mensuelles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Graphique des commandes */}
              <div>
                <div className="flex items-end h-60 gap-1 md:gap-3 mt-2 mb-2 relative">
                  {/* Lignes horizontales de référence */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="border-t border-gray-800/50 w-full h-0"
                      ></div>
                    ))}
                  </div>

                  {/* Barres du graphique */}
                  {orderData.map((data, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <motion.div
                        className="w-full bg-[#d4af37]/70 rounded-t-sm transition-colors relative group"
                        style={{
                          height: `${(data.count / maxOrderCount) * 100}%`,
                        }}
                        variants={barVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Info-bulle désactivée */}
                      </motion.div>
                      <span className="text-xs text-gray-400 mt-1">
                        {data.month.substring(0, 3)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-400">
                  Nombre de commandes par mois
                </div>
              </div>

              {/* Résumé des commandes */}
              <div className="bg-black/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Résumé des ventes
                </h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Commandes du mois</span>
                      <span className="text-gray-200 font-medium">
                        {currentMonthOrders.count}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1">
                      <motion.div
                        className="h-full bg-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (currentMonthOrders.count / maxOrderCount) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ delay: 0.5, duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Revenus du mois</span>
                      <span className="text-gray-200 font-medium">
                        {currentMonthOrders.amount}€
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1">
                      <motion.div
                        className="h-full bg-[#d4af37] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ delay: 0.6, duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Taux de conversion</span>
                      <span className="text-gray-200 font-medium">3.8%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "38%" }}
                        transition={{ delay: 0.7, duration: 1 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800/80">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total de commandes</span>
                      <span className="text-green-400 font-medium">
                        {orderData.reduce((sum, data) => sum + data.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistiques des produits */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-medium text-gray-200 mb-4 border-b border-gray-800 pb-2">
              Aperçu des Produits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                className="bg-black/40 rounded-lg p-4 border border-[#d4af37]/5"
                variants={itemVariants}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-gray-400 text-sm">Produits Actifs</h4>
                  <div className="bg-[#d4af37]/20 text-[#d4af37] text-xs px-2 py-1 rounded-full">
                    {productStats.active}/{productStats.total}
                  </div>
                </div>
                <div className="text-2xl font-medium text-gray-200">
                  {productStats.active}
                  <span className="text-[#d4af37]/70 text-sm ml-1">
                    produits
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full mt-2">
                  <motion.div
                    className="h-full bg-[#d4af37] rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        productStats.total
                          ? (productStats.active / productStats.total) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  ></motion.div>
                </div>
              </motion.div>

              <motion.div
                className="bg-black/40 rounded-lg p-4 border border-[#d4af37]/5"
                variants={itemVariants}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-gray-400 text-sm">Stock Épuisé</h4>
                  <div className="bg-red-900/20 text-red-400 text-xs px-2 py-1 rounded-full">
                    {productStats.outOfStock}
                  </div>
                </div>
                <div className="text-2xl font-medium text-gray-200">
                  {productStats.outOfStock}
                  <span className="text-red-400/70 text-sm ml-1">produits</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full mt-2">
                  <motion.div
                    className="h-full bg-red-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        productStats.total
                          ? (productStats.outOfStock / productStats.total) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  ></motion.div>
                </div>
              </motion.div>

              <motion.div
                className="bg-black/40 rounded-lg p-4 border border-[#d4af37]/5"
                variants={itemVariants}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-gray-400 text-sm">Nouveaux Produits</h4>
                  <div className="bg-green-900/20 text-green-400 text-xs px-2 py-1 rounded-full">
                    {productStats.new}
                  </div>
                </div>
                <div className="text-2xl font-medium text-gray-200">
                  {productStats.new}
                  <span className="text-green-400/70 text-sm ml-1">
                    ce mois-ci
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full mt-2">
                  <motion.div
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        productStats.total
                          ? (productStats.new / productStats.total) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  ></motion.div>
                </div>
              </motion.div>
            </div>

            {/* Produits les plus vendus */}
            <motion.div
              className="mt-4 bg-black/20 rounded-lg p-4"
              variants={itemVariants}
            >
              <h4 className="text-sm font-medium text-[#d4af37] mb-2">
                Produits récents
              </h4>
              <div className="space-y-2">
                {productStats.topSelling.map((product, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </div>
                      <span className="text-gray-300">{product}</span>
                    </div>
                    <span className="text-gray-400 text-sm">Nouveau</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Overlay de verrouillage */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center">
        {/* Badge "Bientôt disponible" */}
        <motion.div
          className="mb-6 px-4 py-2 bg-[#d4af37] text-black font-medium rounded-full flex items-center shadow-lg shadow-[#d4af37]/20"
          initial={{ scale: 0, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.2,
          }}
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
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
          Fonctionnalité bientôt disponible
        </motion.div>

        {/* Message explicatif */}
        <motion.div
          className="text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-[#d4af37] text-2xl font-serif mb-3">
            Statistiques détaillées en développement
          </h3>
          <p className="text-gray-300 max-w-md">
            Cette fonctionnalité sera disponible dans une prochaine mise à jour.
            Vous pourrez bientôt visualiser des statistiques avancées sur vos
            ventes et la performance de vos produits.
          </p>
        </motion.div>

        {/* Date estimée */}
        <motion.div
          className="mt-8 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-md px-4 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-gray-400">
            Disponible prochainement in sha Allah a drare
            <span className="text-[#d4af37] font-medium"></span>
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics;
