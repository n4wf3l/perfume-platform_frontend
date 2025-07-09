import React, { useState, useEffect } from "react";
import type { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface MenuItem {
  title: string;
  icon: ReactElement;
  path: string;
  disabled?: boolean;
}

interface UserData {
  name: string;
  email: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  // State for user data
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const fetchedUser = localStorage.getItem("user");
    if (fetchedUser) {
      try {
        const userData = JSON.parse(fetchedUser);
        // Make sure we have the required fields
        if (userData && userData.name && userData.email) {
          setUser(userData);
        } else {
          console.warn("User data from localStorage is missing required fields");
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  // Animation variants
  const sidebarVariants: Variants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: { x: -20, opacity: 0, transition: { duration: 0.2 } },
  };

  // Menu items with icons
  const menuItems: MenuItem[] = [
    {
      title: "Tableau de bord",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          ></path>
        </svg>
      ),
      path: "/dashboard",
    },
    {
      title: "Produits",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      path: "/dashboard/products",
    },
    {
      title: "Catégories",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      path: "/dashboard/categories",
    },
    {
      title: "Commandes",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      path: "/dashboard/orders",
    },
    {
      title: "Statistiques",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
      ),
      path: "/dashboard/statistics",
      disabled: true, // Désactivé
    },
    {
      title: "Paramètres",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      path: "/dashboard/settings",
      disabled: true, // Désactivé
    },
  ];

  // Fonction pour rendre le bon élément (lien ou div désactivée)
  const renderMenuItem = (item: MenuItem) => {
    const isActive = location.pathname === item.path;

    // Classes communes pour tous les éléments de menu
    const baseClasses = `flex items-center p-3 rounded-lg transition-colors`;

    // Classes spécifiques selon l'état (actif, désactivé, normal)
    const stateClasses = item.disabled
      ? "text-gray-500 opacity-60 cursor-not-allowed bg-transparent"
      : isActive
      ? "bg-[#d4af37]/20 text-[#d4af37]"
      : "text-gray-400 hover:bg-[#d4af37]/10 hover:text-gray-200 cursor-pointer";

    // Combinaison des classes
    const classes = `${baseClasses} ${stateClasses}`;

    if (item.disabled) {
      // Rendu d'une div pour les éléments désactivés
      return (
        <div
          className={classes}
          title="Cette fonctionnalité n'est pas disponible"
        >
          <span className="mr-3">{item.icon}</span>
          <span>{item.title}</span>
          {/* Badge "bientôt" */}
          <span className="ml-auto text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
            Bientôt
          </span>
        </div>
      );
    } else {
      // Rendu d'un lien pour les éléments actifs
      return (
        <Link to={item.path} className={classes}>
          <span className="mr-3">{item.icon}</span>
          <span>{item.title}</span>
          {isActive && (
            <motion.span
              className="ml-auto w-1.5 h-6 bg-[#d4af37] rounded-full"
              layoutId="activeIndicator"
            />
          )}
        </Link>
      );
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 border-r border-[#d4af37]/20 shadow-xl shadow-[#d4af37]/5"
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        {/* Logo */}
        <div className="p-5 border-b border-[#d4af37]/20">
          <motion.div
            className="flex items-center justify-center"
            variants={itemVariants}
          >
            <h1 className="font-serif italic text-2xl text-[#d4af37]">
              Sogno D'Oro
            </h1>
          </motion.div>
        </div>

        {/* User Profile */}
        <motion.div
          className="p-5 border-b border-[#d4af37]/20 flex items-center space-x-3"
          variants={itemVariants}
        >
          <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#d4af37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-sm text-gray-200 font-medium">
              {user ? user.name : 'Admin'}
            </h2>
            <p className="text-xs text-gray-400">
              {user ? user.email : 'admin@sognodoro.com'}
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="p-5 space-y-1">
          {menuItems.map((item, i) => (
            <motion.div key={i} variants={itemVariants}>
              {renderMenuItem(item)}
            </motion.div>
          ))}
        </nav>

        {/* Bottom links */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-[#d4af37]/20">
          <motion.div variants={itemVariants} className="space-y-2">
            <Link
              to="/"
              className="flex items-center p-2 text-gray-400 hover:text-gray-200 rounded-lg"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              Retour au site
            </Link>

            {/* Déconnexion button */}
            <button
              onClick={() => {
                // Here we would typically handle the logout action
                // For example, clearing authentication tokens from localStorage
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // Then redirect to login page or home page
                window.location.href = "/admin";
              }}
              className="flex items-center w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Déconnexion
            </button>

            <button
              onClick={toggleSidebar}
              className="mt-3 lg:hidden w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-200 rounded-lg border border-gray-700"
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Fermer
            </button>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
