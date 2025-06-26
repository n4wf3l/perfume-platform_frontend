import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import KanbanOrders from "./kanbanOrders";
import Toast from "../common/Toast";
import ConfirmModal from "../common/ConfirmModal"; // adapte le chemin

const ViewOrders: React.FC = () => {
  // États pour gérer les filtres et la pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Données factices de commandes
  const orders = [
    {
      id: "ORD-7895",
      customer: {
        name: "Emma Dupont",
        email: "emma.dupont@example.com",
        address: "23 Rue des Lilas, 75001 Paris, France",
      },
      date: "26 Juin 2025",
      amount: "320€",
      paymentMethod: "Carte de crédit",
      status: "completed",
      items: [
        { id: "1", name: "Aurore Mystique", quantity: 1, price: "120€" },
        { id: "5", name: "Secrets d'Orient", quantity: 1, price: "150€" },
        { id: "6", name: "Rêve d'Été", quantity: 1, price: "50€" },
      ],
    },
    {
      id: "ORD-7894",
      customer: {
        name: "Thomas Bernard",
        email: "t.bernard@example.com",
        address: "45 Avenue Victor Hugo, 69002 Lyon, France",
      },
      date: "25 Juin 2025",
      amount: "175€",
      paymentMethod: "PayPal",
      status: "processing",
      items: [
        { id: "3", name: "Brise de Venise", quantity: 2, price: "85€" },
        {
          id: "2",
          name: "Élixir Nocturne",
          sample: true,
          quantity: 1,
          price: "5€",
        },
      ],
    },
    {
      id: "ORD-7893",
      customer: {
        name: "Sophie Martin",
        email: "sophiemartin@example.com",
        address: "12 Boulevard de la Liberté, 59000 Lille, France",
      },
      date: "25 Juin 2025",
      amount: "450€",
      paymentMethod: "Carte de crédit",
      status: "completed",
      items: [
        { id: "2", name: "Élixir Nocturne", quantity: 2, price: "180€" },
        { id: "4", name: "Séduction Orientale", quantity: 1, price: "90€" },
      ],
    },
    {
      id: "ORD-7892",
      customer: {
        name: "Alexandre Petit",
        email: "alex.petit@example.com",
        address: "7 Rue du Commerce, 44000 Nantes, France",
      },
      date: "24 Juin 2025",
      amount: "220€",
      paymentMethod: "Apple Pay",
      status: "shipped",
      items: [
        { id: "1", name: "Aurore Mystique", quantity: 1, price: "120€" },
        { id: "6", name: "Rêve d'Été", quantity: 1, price: "110€" },
      ],
    },
    {
      id: "ORD-7891",
      customer: {
        name: "Marie Laurent",
        email: "m.laurent@example.com",
        address: "56 Rue de la Paix, 13001 Marseille, France",
      },
      date: "23 Juin 2025",
      amount: "190€",
      paymentMethod: "Carte de crédit",
      status: "pending",
      items: [
        { id: "3", name: "Brise de Venise", quantity: 1, price: "85€" },
        { id: "5", name: "Secrets d'Orient", quantity: 1, price: "105€" },
      ],
    },
    {
      id: "ORD-7890",
      customer: {
        name: "Pierre Durand",
        email: "pierre.durand@example.com",
        address: "34 Avenue des Champs-Élysées, 75008 Paris, France",
      },
      date: "22 Juin 2025",
      amount: "360€",
      paymentMethod: "Carte de crédit",
      status: "cancelled",
      items: [{ id: "2", name: "Élixir Nocturne", quantity: 2, price: "360€" }],
    },
  ];

  // Filtrer les commandes en fonction des critères
  const filteredOrders = orders.filter((order) => {
    // Filtre par texte de recherche
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par statut
    const statusMatch = statusFilter === "all" || order.status === statusFilter;

    // Filtre par date (simpliste pour la démonstration)
    let dateMatch = true;
    if (dateFilter === "today") {
      dateMatch = order.date === "26 Juin 2025"; // Simulation "aujourd'hui"
    } else if (dateFilter === "week") {
      dateMatch = [
        "26 Juin 2025",
        "25 Juin 2025",
        "24 Juin 2025",
        "23 Juin 2025",
        "22 Juin 2025",
      ].includes(order.date);
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Changer le statut d'une commande
  const changeOrderStatus = (orderId: string, newStatus: string) => {
    // Dans un cas réel, ce serait un appel d'API
    // Mets à jour le statut dans le state ici si tu veux un effet immédiat
    setToastMessage(
      `Statut de la commande ${orderId} mis à jour vers "${getStatusLabel(
        newStatus
      )}"`
    );
    setToastVisible(true);
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
      case "processing":
        return "En cours";
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
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  return (
    <motion.div
      className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-serif text-[#d4af37]">
          Gestion des Commandes
        </h2>
      </div>

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
              <option value="processing">En cours</option>
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
            {filteredOrders.map((order, idx) => (
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
                      {order.customer.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#d4af37]">
                    {order.amount}
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
                    <select
                      className="text-xs rounded-md bg-gray-900 border border-gray-700 focus:border-[#d4af37] focus:ring focus:ring-[#d4af37]/20 focus:outline-none text-gray-300"
                      value={order.status}
                      onChange={(e) =>
                        changeOrderStatus(order.id, e.target.value)
                      }
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">En cours</option>
                      <option value="shipped">Expédiée</option>
                      <option value="completed">Complétée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
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
                            {order.customer.address}
                          </p>

                          <h4 className="text-sm font-medium text-[#d4af37] mb-2">
                            Détails de paiement
                          </h4>
                          <p className="text-sm text-gray-300">
                            {order.paymentMethod}
                          </p>
                        </div>

                        {/* Produits commandés */}
                        <div>
                          <h4 className="text-sm font-medium text-[#d4af37] mb-2">
                            Produits commandés
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div
                                key={`${order.id}-${item.id}`}
                                className="flex justify-between items-center border-b border-gray-700 pb-2"
                              >
                                <div>
                                  <span className="text-gray-200">
                                    {item.name}
                                  </span>
                                  {item.sample && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                      Échantillon
                                    </span>
                                  )}
                                  <div className="text-xs text-gray-400">
                                    Quantité: {item.quantity}
                                  </div>
                                </div>
                                <span className="text-[#d4af37]">
                                  {item.price}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-right">
                            <span className="text-sm font-medium text-gray-400">
                              Total:{" "}
                            </span>
                            <span className="text-lg font-semibold text-[#d4af37]">
                              {order.amount}
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
              Affichage de <span className="font-medium">1</span> à{" "}
              <span className="font-medium">{filteredOrders.length}</span> sur{" "}
              <span className="font-medium">{orders.length}</span> résultats
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
        onConfirm={() => {
          setModalOpen(false);
          setToastMessage("Commande supprimée avec succès !");
          setToastVisible(true);
          // Ici, retire la commande du state si tu veux un effet immédiat
          // Ex : setOrders(orders.filter(o => o.id !== orderToDelete));
          setOrderToDelete(null);
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
