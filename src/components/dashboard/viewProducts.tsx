import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Toast from "../common/Toast";
import ConfirmModal from "../common/ConfirmModal";
import productService from "../../services/productService";
import type { Product } from "../../types/api";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const ViewProducts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]); 
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | 'multiple' | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
        
        // Initialize featured products
        const featuredProducts = data.filter(p => p.is_flagship).map(p => p.id);
        setFeaturedIds(featuredProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Échec du chargement des produits. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

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
  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(
        selectedProducts.filter((productId) => productId !== id)
      );
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Fonction pour gérer les produits à la une (flagship products)
  const handleFeaturedToggle = async (id: number) => {
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
      (product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  // Fonction pour supprimer les produits sélectionnés
  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      setProductToDelete("multiple");
      setModalOpen(true);
    }
  };

  // Fonction pour sauvegarder les produits à la une
  const saveFeaturedProducts = async () => {
    try {
      setToastMessage("Mise à jour des produits à la une...");
      setToastVisible(true);
      
      // TODO: Implement API call to update featured products
      // This would need a new endpoint in the backend
      
      setToastMessage("Produits à la une mis à jour avec succès!");
      setToastVisible(true);
    } catch (err) {
      console.error("Failed to update featured products:", err);
      setToastMessage("Échec de la mise à jour des produits à la une.");
      setToastVisible(true);
    }
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
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="flex items-center justify-center text-[#d4af37]">
            <svg
              className="animate-spin -ml-1 mr-3 h-10 w-10"
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
            <span>Chargement des produits...</span>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 m-6 rounded-md">
          <div className="flex items-center">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
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
          <button 
            className="mt-2 px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 text-sm rounded-md"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      {!loading && !error && (
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
                  className="ml-4 px-4 py-2 border border-[#d4af37]/50 text-sm font-medium rounded-md text-[#d4af37] bg-black hover:bg-gray-800"
                >
                  Sauvegarder les produits à la une ({featuredIds.length}/3)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
                        src={product.images && product.images.length > 0 
                          ? `${IMAGE_URL}/${
                              // Find image with order 01 or use the first image as fallback
                              product.images.find(img => img.order === 0)?.path || 
                              product.images[0].path
                            }` 
                          : "/perfums.jpg"}
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
                    {product.category?.name || "Non catégorisé"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#d4af37]">{product.price}€</div>
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
            
            {filteredProducts.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <svg 
                      className="w-12 h-12 mb-4 text-gray-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="1" 
                        d="M9 17l6-6-6-6"
                      />
                    </svg>
                    {searchTerm 
                      ? "Aucun produit ne correspond à votre recherche." 
                      : "Aucun produit n'est disponible. Ajoutez votre premier produit."}
                    <button
                      onClick={() => navigate("/dashboard/products/add")}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-[#d4af37]/50 text-sm font-medium rounded-md text-[#d4af37] bg-black hover:bg-gray-800"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>



      {/* Pagination - To be implemented with backend pagination support */}
      <div className="px-6 py-4 bg-black/40 border-t border-gray-800 flex items-center justify-between">
        <div className="flex-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">
              <span className="font-medium">{filteredProducts.length}</span> {filteredProducts.length > 1 ? 'produits' : 'produit'} 
              {searchTerm && ` trouvé${filteredProducts.length > 1 ? 's' : ''} pour "${searchTerm}"`}
            </p>
          </div>
          <div>
            {/* Pagination will be implemented with backend pagination support */}
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
        onConfirm={async () => {
          setModalOpen(false);
          try {
            if (productToDelete === "multiple") {
              // Suppression multiple
              for (const productId of selectedProducts) {
                await productService.deleteProduct(productId);
              }
              setToastMessage(
                `${selectedProducts.length} produit(s) supprimé(s) avec succès`
              );
              setSelectedProducts([]);
            } else if (productToDelete !== null) {
              // Suppression individuelle
              await productService.deleteProduct(productToDelete);
              setToastMessage("Produit supprimé avec succès");
            }
            
            // Refresh products
            const data = await productService.getAllProducts();
            setProducts(data);
            
            // Update featured products
            const featuredProducts = data.filter(p => p.is_flagship).map(p => p.id);
            setFeaturedIds(featuredProducts);
            
          } catch (err) {
            console.error("Failed to delete product(s):", err);
            setToastMessage("Échec de la suppression du/des produit(s)");
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
