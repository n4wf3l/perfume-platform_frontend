import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import KanbanOrders from "./kanbanOrders";
import Toast from "../common/Toast";
import ConfirmModal from "../common/ConfirmModal";
import orderService from "../../services/orderService";
import type { Order } from "../../types/api";

const ViewOrders: React.FC = () => {
  // États pour gérer les filtres, la pagination et les données
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  
  // États pour les données et leur chargement
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Charger les commandes depuis l'API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getAllOrders();
        
        // If we have an expanded order, fetch its details to ensure we have the latest data
        if (expandedOrderId) {
          try {
            const detailedOrder = await orderService.getOrder(expandedOrderId);
            // Replace the order in the list with the detailed version
            const updatedOrders = data.map(order => 
              order.id === expandedOrderId ? detailedOrder : order
            );
            setOrders(updatedOrders);
          } catch (detailErr) {
            console.error("Error fetching order details:", detailErr);
            setOrders(data);
          }
        } else {
          setOrders(data);
        }
        
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des commandes. Veuillez réessayer.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [expandedOrderId]);

  // Fonction pour formater une date
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Filtrer les commandes en fonction des critères
  const filteredOrders = orders.filter((order) => {
    // Filtre par texte de recherche
    const searchMatch =
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par statut
    const statusMatch = statusFilter === "all" || order.status === statusFilter;

    // Filtre par date
    let dateMatch = true;
    const orderDate = order.created_at ? new Date(order.created_at) : null;
    
    if (dateFilter === "today" && orderDate) {
      const today = new Date();
      dateMatch = orderDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week" && orderDate) {
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      dateMatch = orderDate >= weekAgo && orderDate <= today;
    } else if (dateFilter === "month" && orderDate) {
      const today = new Date();
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      dateMatch = orderDate >= monthAgo && orderDate <= today;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Changer le statut d'une commande
  const changeOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      
      // Appeler l'API pour mettre à jour le statut
      await orderService.updateOrderStatus(orderId, newStatus);
      
      // Mettre à jour l'état local pour refléter le changement immédiatement
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
      );
      
      setToastMessage(
        `Statut de la commande #${orderId} mis à jour vers "${getStatusLabel(
          newStatus
        )}"`
      );
      setToastVisible(true);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setToastMessage('Erreur lors de la mise à jour du statut de la commande.');
      setToastVisible(true);
      
      // En cas d'erreur, rafraîchir les commandes pour s'assurer que nous avons les données à jour
      refreshOrders();
    } finally {
      setUpdatingOrderId(null);
    }
  };
  
  // Fonction pour rafraîchir la liste des commandes
  const refreshOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des commandes:", err);
    }
  };

  // Fonction pour obtenir la classe de style en fonction du statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900/30 text-green-400";
      case "processing":
        return "bg-blue-900/30 text-blue-400";
      case "shipped":
        return "bg-purple-900/30 text-purple-400";
      case "pending":
        return "bg-yellow-900/30 text-yellow-400";
      case "cancelled":
        return "bg-red-900/30 text-red-400";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Complétée";
      case "paid":
        return "Payé";
      case "shipped":
        return "Expédiée";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  // Gestion des détails d'une commande
  const toggleOrderDetails = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      
      // Fetch detailed order data when expanding
      try {
        const detailedOrder = await orderService.getOrder(orderId);
        
        // Update the order in the list with the detailed version
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? detailedOrder : order
          )
        );
      } catch (error) {
        console.error("Error fetching order details:", error);
        // Show toast message if there's an error
        setToastMessage("Erreur lors du chargement des détails de la commande.");
        setToastVisible(true);
      }
    }
  };

  return (
    <motion.div
      className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-xl font-serif text-[#d4af37]">
          Gestion des Commandes
        </h2>
        <button 
          onClick={refreshOrders}
          className="px-3 py-1 border border-[#d4af37]/40 text-[#d4af37] text-sm rounded-md hover:bg-[#d4af37]/10 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#d4af37] mr-2"></div>
              Chargement...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </>
          )}
        </button>
      </div>
      
      {/* Loading and error states */}
      {loading && (
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d4af37] mr-2"></div>
          <span className="text-gray-300">Chargement des commandes...</span>
        </div>
      )}
      
      {error && (
        <div className="p-6 bg-red-900/20 border border-red-800 rounded-md m-6">
          <p className="text-red-400">{error}</p>
          <button 
            className="mt-2 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="p-6 border-b border-gray-800 bg-black/40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 py-2 block w-full rounded-md bg-gray-900 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtre par statut */}
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Statut
            </label>
            <select
              id="statusFilter"
              className="block w-full rounded-md bg-gray-900 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
              <option value="shipped">Expédiée</option>
              <option value="completed">Complétée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          {/* Filtre par date */}
          <div>
            <label
              htmlFor="dateFilter"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Date
            </label>
            <select
              id="dateFilter"
              className="block w-full rounded-md bg-gray-900 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois-ci</option>
            </select>
          </div>

          {/* Résultats */}
          <div className="flex items-end">
            <span className="text-sm text-gray-400">
              {filteredOrders.length} commande(s) trouvée(s)
            </span>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-black/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Commande
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Client
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Montant
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Statut
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
            {!loading && filteredOrders.map((order, idx) => (
              <React.Fragment key={order.id}>
                <motion.tr
                  className="hover:bg-gray-800/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm font-medium text-[#d4af37] cursor-pointer flex items-center"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      #{order.id}
                      <svg
                        className={`w-4 h-4 ml-2 transition-transform ${
                          expandedOrderId === order.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">
                      {order.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.created_at ? formatDate(order.created_at) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#d4af37]">
                    {order.total ? `${order.total}€` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    {updatingOrderId === order.id ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#d4af37] mr-2"></div>
                        <span className="text-xs text-gray-400">Mise à jour...</span>
                      </div>
                    ) : (
                      <select
                        className="text-xs rounded-md bg-gray-900 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                        value={order.status}
                        onChange={(e) =>
                          changeOrderStatus(order.id, e.target.value)
                        }
                        disabled={updatingOrderId !== null}
                      >
                        <option value="pending">En attente</option>
                        <option value="paid">Payé</option>
                        <option value="shipped">Expédiée</option>
                        <option value="completed">Complétée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    )}
                    <button
                      className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Supprimer la commande"
                      onClick={() => {
                        setOrderToDelete(order.id);
                        setModalOpen(true);
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </motion.tr>

                {/* Détails de la commande */}
                {expandedOrderId === order.id && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-800/30"
                  >
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Adresse et détails de paiement */}
                        <div>
                          <h4 className="text-sm font-medium text-[#d4af37] mb-2">
                            Détails de livraison
                          </h4>
                          <p className="text-sm text-gray-300 mb-4">
                            {order.address}, {order.city}, {order.postal_code}
                          </p>
                          <p className="text-sm text-gray-300 mb-4">
                            <strong>Téléphone:</strong> {order.phone}
                          </p>

                          <h4 className="text-sm font-medium text-[#d4af37] mb-2">
                            Détails de paiement
                          </h4>
                          <p className="text-sm text-gray-300">
                            {order.paypal_order_id ? `PayPal (ID: ${order.paypal_order_id})` : 'Méthode de paiement non disponible'}
                          </p>
                        </div>

                        {/* Produits commandés */}
                        <div>
                          <h4 className="text-sm font-medium text-[#d4af37] mb-2">
                            Produits commandés
                          </h4>
                          <div className="space-y-2">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item) => (
                                <div
                                  key={`${order.id}-${item.id}`}
                                  className="flex justify-between items-center border-b border-gray-700 pb-2"
                                >
                                  <div>
                                    <span className="text-gray-200">
                                      {item.product?.name || `Produit #${item.product_id}`}
                                    </span>
                                    <div className="text-xs text-gray-400">
                                      Quantité: {item.quantity}
                                    </div>
                                  </div>
                                  <span className="text-[#d4af37]">
                                    {item.price}€
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">Aucun détail de produit disponible</p>
                            )}
                          </div>
                          
                          <div className="mt-4 text-right">
                            <span className="text-sm font-medium text-gray-400">
                              Total: {" "}
                            </span>
                            <span className="text-lg font-semibold text-[#d4af37]">
                              {order.total}€
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions spécifiques */}
                      <div className="mt-6 flex space-x-3">
                        <button className="px-3 py-1 border border-[#d4af37]/40 text-[#d4af37] text-sm rounded-md hover:bg-[#d4af37]/10">
                          Imprimer la facture
                        </button>
                        <button className="px-3 py-1 border border-gray-600 text-gray-300 text-sm rounded-md hover:bg-gray-800">
                          Envoyer un email
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-black/40 border-t border-gray-800 flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              {loading ? (
                "Chargement..."
              ) : (
                <>
                  Affichage de <span className="font-medium">1</span> à{" "}
                  <span className="font-medium">{filteredOrders.length}</span> sur{" "}
                  <span className="font-medium">{orders.length}</span> résultats
                </>
              )}
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

      {/* Kanban Orders directement sous le tableau */}
      <div className="mt-10">
        <KanbanOrders />
      </div>

      {/* Toast et modal de confirmation */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Supprimer la commande"
        message="Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible."
        onCancel={() => {
          setModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={async () => {
          if (orderToDelete) {
            try {
              await orderService.deleteOrder(orderToDelete);
              setOrders(orders.filter(o => o.id !== orderToDelete));
              setToastMessage("Commande supprimée avec succès !");
            } catch (error) {
              console.error("Erreur lors de la suppression de la commande:", error);
              setToastMessage("Erreur lors de la suppression de la commande.");
            } finally {
              setModalOpen(false);
              setToastVisible(true);
              setOrderToDelete(null);
            }
          }
        }}
      />

      {toastVisible && (
        <Toast
          message={toastMessage}
          isVisible={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      )}
    </motion.div>
  );
};

export default ViewOrders;
