import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../common/Toast";
import ConfirmModal from "../common/ConfirmModal";
import categoryService from "../../services/categoryService";
import type { CategoryWithCount } from "../../services/categoryService";

const ViewCategory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Update state type to use CategoryWithCount
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Show toast message from navigation state
  useEffect(() => {
    if (location.state?.showToast) {
      setToastVisible(true);
      setToastMessage(
        location.state.showToast === "edit"
          ? "Catégorie modifiée avec succès !"
          : "Catégorie ajoutée avec succès !"
      );
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch categories with product counts from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Utiliser directement le service API qui gère correctement les headers et les formats
        // Ne pas utiliser fetch directement car il peut y avoir des problèmes de CORS ou d'authentification
        // Use the new method that includes product counts
        const data = await categoryService.getCategoriesWithProductCount();
        
        // Directement utiliser products_count comme valeur pour productCount
        // Les logs montrent que l'API renvoie déjà products_count
        const categoriesWithValidCounts = data.map(cat => {
          // Vérifier si cat a les propriétés attendues pour éviter les erreurs
          const category = {...cat};
          
          // Utiliser products_count directement si disponible
          if (cat.products_count !== undefined) {
            category.productCount = cat.products_count;
          }
          
          return category;
        });
        
        setCategories(categoriesWithValidCounts);
      } catch (err) {
        setError("Impossible de récupérer les catégories. Veuillez réessayer.");
        
        // Fallback to regular getAllCategories if the with-product-count endpoint fails
        try {
          const fallbackData = await categoryService.getAllCategories();
          // Set product count to 0 as fallback
          const categoriesWithZeroCount = fallbackData.map(cat => ({
            ...cat,
            productCount: 0
          }));
          setCategories(categoriesWithZeroCount);
        } catch (fallbackErr) {
          // Silently fail - we already showed the main error
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Fonction pour gérer la sélection des catégories
  const handleSelectCategory = (id: number) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(
        selectedCategories.filter((categoryId) => categoryId !== id)
      );
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  // Filtrer les catégories en fonction de la recherche
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour supprimer une catégorie
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      setDeleting(true);
      setError(null);

      await categoryService.deleteCategory(categoryId);

      // Update local state after successful deletion
      setCategories(categories.filter((category) => category.id !== categoryId));
      setToastMessage("Catégorie supprimée avec succès !");
      setToastVisible(true);
    } catch (err) {
      setError("Erreur lors de la suppression de la catégorie. Veuillez réessayer.");
      setToastVisible(true);
      setToastMessage("Erreur lors de la suppression de la catégorie.");
    } finally {
      setDeleting(false);
      setModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Fonction pour supprimer les catégories sélectionnées
  const handleDeleteSelected = async () => {
    try {
      setDeleting(true);
      setError(null);

      // Delete categories one by one (could be improved with bulk delete API)
      for (const categoryId of selectedCategories) {
        await categoryService.deleteCategory(categoryId);
      }

      // Update local state after successful deletion
      setCategories(
        categories.filter((category) => !selectedCategories.includes(category.id))
      );
      setToastMessage(`${selectedCategories.length} catégorie(s) supprimée(s) avec succès !`);
      setToastVisible(true);
      setSelectedCategories([]);
    } catch (err) {
      setError("Erreur lors de la suppression des catégories. Veuillez réessayer.");
      setToastVisible(true);
      setToastMessage("Erreur lors de la suppression des catégories.");
    } finally {
      setDeleting(false);
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5">
      <div className="p-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-serif text-[#d4af37] mb-4 md:mb-0">
            Gestion des Catégories
          </h2>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            {/* Afficher le bouton "Ajouter une catégorie" uniquement quand aucune catégorie n'est sélectionnée */}
            {selectedCategories.length === 0 ? (
              <button
                onClick={() => navigate("/dashboard/categories/add")}
                className="inline-flex items-center px-4 py-2 border border-[#d4af37]/50 text-sm font-medium rounded-md text-[#d4af37] bg-black hover:bg-gray-800"
                disabled={loading}
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
                Ajouter une catégorie
              </button>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-red-500/50 text-sm font-medium rounded-md text-red-400 bg-black hover:bg-gray-800"
                disabled={deleting || loading}
              >
                {deleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Suppression...
                  </>
                ) : (
                  <>
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
                    Supprimer ({selectedCategories.length})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Display error message */}
      {error && (
        <div className="p-4 bg-red-900/40 border-l-4 border-red-500 text-sm text-red-300 m-4">
          <div className="flex">
            <svg
              className="h-5 w-5 mr-2 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
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
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="text-sm text-gray-400">
            {filteredCategories.length} catégorie(s) trouvée(s)
          </div>
        </div>
      </div>

      {/* Liste des catégories - Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <div className="text-[#d4af37] flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Chargement des catégories...
          </div>
        </div>
      )}

      {/* Liste des catégories - Empty state */}
      {!loading && filteredCategories.length === 0 && (
        <div className="bg-gray-800/30 rounded-lg p-8 m-4 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-300">
            Aucune catégorie trouvée
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Essayez avec un autre terme de recherche."
              : "Ajoutez une nouvelle catégorie pour commencer."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-[#d4af37] hover:text-[#d4af37]/70"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Liste des catégories - Data display */}
      {!loading && filteredCategories.length > 0 && (
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
                        setSelectedCategories(categories.map((c) => c.id));
                      } else {
                        setSelectedCategories([]);
                      }
                    }}
                    checked={
                      selectedCategories.length === categories.length &&
                      categories.length > 0
                    }
                    disabled={loading || deleting}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Nom
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Produits
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Date de Création
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
              {filteredCategories.map((category) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded text-[#d4af37] border-gray-700 bg-gray-900 focus:ring-[#d4af37]/30"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleSelectCategory(category.id)}
                      disabled={deleting}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-200">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300">
                        {category.products_count !== undefined ? category.products_count : category.productCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {formatDate(category.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/categories/edit/${category.id}`)
                        }
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="Modifier cette catégorie"
                        disabled={deleting}
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
                          setCategoryToDelete(category.id);
                          setModalOpen(true);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Supprimer cette catégorie"
                        disabled={deleting}
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
                      <button
                        onClick={() => navigate(`/shop?category=${category.id}`)}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                        title="Voir les produits de cette catégorie"
                        disabled={deleting}
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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
      )}

      {/* Pagination - Could be updated to work with API pagination */}
      {!loading && filteredCategories.length > 0 && (
        <div className="px-6 py-4 bg-black/40 border-t border-gray-800 flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Affichage de <span className="font-medium">1</span> à{" "}
                <span className="font-medium">{filteredCategories.length}</span>{" "}
                sur <span className="font-medium">{categories.length}</span>{" "}
                résultats
              </p>
            </div>
            {/* Simple pagination example that could be enhanced with actual API pagination */}
            <div>
              <nav
                className="relative z-0 inline-flex shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-900 text-sm font-medium text-gray-400 hover:bg-gray-800 disabled:opacity-50"
                  disabled={true}
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
                </button>
                <button
                  aria-current="page"
                  className="z-10 bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37] relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-900 text-sm font-medium text-gray-400 hover:bg-gray-800 disabled:opacity-50"
                  disabled={true}
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
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage || "Action effectuée avec succès !"}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      
      {/* Confirm Modal for Single Delete */}
      <ConfirmModal
        isOpen={modalOpen && categoryToDelete !== null}
        title="Supprimer la catégorie"
        message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
        onCancel={() => {
          setModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={() => {
          if (categoryToDelete !== null) {
            handleDeleteCategory(categoryToDelete);
          }
        }}
      />
      
      {/* Confirm Modal for Bulk Delete */}
      <ConfirmModal
        isOpen={modalOpen && categoryToDelete === null && selectedCategories.length > 0}
        title={`Supprimer ${selectedCategories.length} catégories`}
        message={`Êtes-vous sûr de vouloir supprimer ces ${selectedCategories.length} catégories ? Cette action est irréversible.`}
        onCancel={() => setModalOpen(false)}
        onConfirm={handleDeleteSelected}
      />
    </div>
  );
};

export default ViewCategory;
