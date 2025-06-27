import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../common/Toast";
import ConfirmModal from "../common/ConfirmModal"; // adapte le chemin

const ViewProducts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [featuredIds, setFeaturedIds] = useState<string[]>(["1", "3", "5"]); // IDs des produits mis en avant
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Données de produits avec des chemins d'images réels
  const products = [
    {
      id: "1",
      name: "Aurore Mystique",
      image: "/perfum1.jpg", // Image réelle du dossier public
      category: "Eau de Parfum",
      price: "120€",
      stock: 24,
      featured: true,
      gender: "unisexe", // <-- AJOUT
    },
    {
      id: "2",
      name: "Élixir Nocturne",
      image: "/perfum2.jpg", // Image réelle du dossier public
      category: "Parfum",
      price: "180€",
      stock: 15,
      featured: false,
    },
    {
      id: "3",
      name: "Brise de Venise",
      image: "/perfum3.jpg", // Image réelle du dossier public
      category: "Eau de Toilette",
      price: "85€",
      stock: 32,
      featured: true,
    },
    {
      id: "4",
      name: "Séduction Orientale",
      image: "/perfums.jpg", // Image réelle du dossier public
      category: "Parfum",
      price: "145€",
      stock: 10,
      featured: false,
    },
    {
      id: "5",
      name: "Secrets d'Orient",
      image: "/perfum2.jpg", // Réutilisation d'une image existante
      category: "Parfum",
      price: "150€",
      stock: 18,
      featured: true,
    },
    {
      id: "6",
      name: "Rêve d'Été",
      image: "/perfum1.jpg", // Réutilisation d'une image existante
      category: "Eau de Parfum",
      price: "110€",
      stock: 26,
      featured: false,
    },
  ];

  useEffect(() => {
    if (location.state?.showToast) {
      setToastVisible(true);
      setToastMessage(
        location.state.showToast === "edit"
          ? "Produit modifié avec succès !"
          : "Produit ajouté avec succès !"
      );
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fonction pour gérer la sélection des produits
  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(
        selectedProducts.filter((productId) => productId !== id)
      );
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Fonction pour gérer les produits à la une
  const handleFeaturedToggle = (id: string) => {
    // Si le produit est déjà en vedette, le retirer
    if (featuredIds.includes(id)) {
      setFeaturedIds(featuredIds.filter((productId) => productId !== id));
    }
    // Sinon, l'ajouter (si moins de 3 sont sélectionnés)
    else if (featuredIds.length < 3) {
      setFeaturedIds([...featuredIds, id]);
    }
    // Si 3 sont déjà sélectionnés, afficher une alerte
    else {
      setToastMessage(
        "Vous ne pouvez sélectionner que 3 produits à la une. Veuillez d'abord en désélectionner un."
      );
      setToastVisible(true);
    }
  };

  // Filtrer les produits en fonction de la recherche
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour supprimer les produits sélectionnés
  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      setProductToDelete("multiple");
      setModalOpen(true);
    }
  };

  // Fonction pour sauvegarder les produits à la une
  const saveFeaturedProducts = () => {
    // Logique pour sauvegarder dans la base de données (à implémenter)
    alert("Produits à la une mis à jour avec succès!");
  };

  return (
    <div className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5">
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-serif text-[#d4af37] mb-4 md:mb-0">
            Gestion des Produits
          </h2>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            {/* Bouton "Ajouter un produit" qui disparaît quand des produits sont sélectionnés */}
            {selectedProducts.length === 0 ? (
              <button
                onClick={() => navigate("/dashboard/products/add")}
                className="inline-flex items-center px-4 py-2 border border-[#d4af37]/50 text-sm font-medium rounded-md text-[#d4af37] bg-black hover:bg-gray-800"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                Ajouter un produit
              </button>
            ) : (
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center px-4 py-2 border border-red-500/50 text-sm font-medium rounded-md text-red-400 bg-black hover:bg-gray-800"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                Supprimer ({selectedProducts.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="p-6 border-b border-gray-800 bg-black/40">
        <div className="md:flex md:items-center">
          <div className="relative flex-1 mb-4 md:mb-0 md:mr-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 py-2 block w-full rounded-md bg-gray-900 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between md:justify-start">
            <div className="text-sm text-gray-400">
              {filteredProducts.length} produit(s) trouvé(s)
            </div>
            {featuredIds.length > 0 && (
              <button
                onClick={saveFeaturedProducts}
                className="ml-4 px-4 py-2 border border-green-500/50 text-sm font-medium rounded-md text-green-400 bg-black hover:bg-gray-800"
              >
                Enregistrer la sélection à la une ({featuredIds.length}/3)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-black/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  className="rounded text-[#d4af37] border-gray-700 bg-gray-900 focus:ring-[#d4af37]/30"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProducts(products.map((p) => p.id));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
                  }
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Produit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Catégorie
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Prix
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Stock
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                À la une
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {filteredProducts.map((product, idx) => (
              <motion.tr
                key={product.id}
                className="hover:bg-gray-800/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded text-[#d4af37] border-gray-700 bg-gray-900 focus:ring-[#d4af37]/30"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/perfums.jpg";
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-200">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#d4af37]">{product.price}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                      product.stock > 20
                        ? "bg-green-900/30 text-green-400"
                        : product.stock > 10
                        ? "bg-yellow-900/30 text-yellow-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="rounded-full h-6 w-6 text-[#d4af37] border-gray-700 bg-gray-900 focus:ring-[#d4af37]/30"
                      checked={featuredIds.includes(product.id)}
                      onChange={() => handleFeaturedToggle(product.id)}
                      disabled={
                        !featuredIds.includes(product.id) &&
                        featuredIds.length >= 3
                      }
                      title={
                        !featuredIds.includes(product.id) &&
                        featuredIds.length >= 3
                          ? "Maximum 3 produits à la une"
                          : ""
                      }
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/products/edit/${product.id}`)
                      }
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(product.id);
                        setModalOpen(true);
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-black/40 border-t border-gray-800 flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Affichage de <span className="font-medium">1</span> à{" "}
              <span className="font-medium">{filteredProducts.length}</span> sur{" "}
              <span className="font-medium">{products.length}</span> résultats
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-900 text-sm font-medium text-gray-400 hover:bg-gray-800"
              >
                <span className="sr-only">Précédent</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-current="page"
                className="z-10 bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37] relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-900 text-sm font-medium text-gray-400 hover:bg-gray-800"
              >
                <span className="sr-only">Suivant</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Supprimer le(s) produit(s)"
        message={
          productToDelete === "multiple"
            ? `Êtes-vous sûr de vouloir supprimer ${selectedProducts.length} produit(s) ? Cette action est irréversible.`
            : `Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.`
        }
        onCancel={() => {
          setModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => {
          setModalOpen(false);
          if (productToDelete === "multiple") {
            // Suppression multiple
            setToastMessage(
              `${selectedProducts.length} produit(s) supprimé(s) avec succès`
            );
            setSelectedProducts([]);
          } else {
            // Suppression individuelle
            setToastMessage("Produit supprimé avec succès");
          }
          setToastVisible(true);
          setProductToDelete(null);
        }}
      />

      {/* Toast Notification */}
      {toastVisible && (
        <Toast
          message={toastMessage}
          isVisible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      )}
    </div>
  );
};

export default ViewProducts;
