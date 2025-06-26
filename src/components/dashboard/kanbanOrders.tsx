import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragStartEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Types pour le typage TypeScript
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  sample?: boolean;
}

interface Customer {
  name: string;
  email: string;
  address: string;
}

interface Order {
  id: string;
  customer: Customer;
  date: string;
  amount: string;
  paymentMethod: string;
  status: string;
  items: OrderItem[];
}

interface Column {
  id: string;
  title: string;
  orders: Order[];
}

// Composant pour une carte d'ordre individuelle
const OrderCard = ({
  order,
  expandedOrderId,
  toggleOrderDetails,
  isDragging = false,
}: {
  order: Order;
  expandedOrderId: string | null;
  toggleOrderDetails: (id: string) => void;
  isDragging?: boolean;
}) => {
  return (
    <motion.div
      className={`p-3 mb-3 rounded-lg bg-gray-900 border border-gray-700 shadow-sm ${
        isDragging ? "shadow-xl ring-2 ring-[#d4af37]/30 opacity-75" : ""
      }`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex justify-between items-center mb-2">
        <div
          className="text-[#d4af37] font-medium cursor-pointer flex items-center"
          onClick={() => toggleOrderDetails(order.id)}
        >
          #{order.id}
          <svg
            className={`w-4 h-4 ml-1 transition-transform ${
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
        <div className="text-[#d4af37]">{order.amount}</div>
      </div>

      <div className="text-sm text-gray-200">{order.customer.name}</div>
      <div className="text-xs text-gray-400">{order.date}</div>

      {/* Détails de la commande */}
      <AnimatePresence>
        {expandedOrderId === order.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-gray-700"
          >
            <div className="text-xs text-gray-400 mb-2">
              <div className="mb-1">{order.customer.email}</div>
              <div>{order.customer.address}</div>
            </div>

            <div className="mt-2">
              <div className="text-xs font-medium text-gray-300 mb-1">
                Produits:
              </div>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="text-gray-300">
                    {item.quantity}× {item.name}
                    {item.sample && (
                      <span className="ml-1 px-1 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                        Éch.
                      </span>
                    )}
                  </div>
                  <div className="text-[#d4af37]/80">{item.price}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-xs">
              <div className="text-gray-400">{order.paymentMethod}</div>
              <div className="flex items-center">
                <button className="text-[#d4af37] hover:text-[#d4af37]/80 mr-2">
                  Détails
                </button>
                <button className="text-gray-400 hover:text-gray-300">
                  Facture
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Composant d'ordre triable
const SortableOrder = ({
  order,
  expandedOrderId,
  toggleOrderDetails,
}: {
  order: Order;
  expandedOrderId: string | null;
  toggleOrderDetails: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OrderCard
        order={order}
        expandedOrderId={expandedOrderId}
        toggleOrderDetails={toggleOrderDetails}
        isDragging={isDragging}
      />
    </div>
  );
};

// Composant principal Kanban
const KanbanOrders: React.FC = () => {
  // Données initiales provenant de viewOrders.tsx
  const initialOrders: Order[] = [
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

  // Définition des colonnes
  const columnDefinitions = [
    { id: "pending", title: "En attente" },
    { id: "processing", title: "En cours" },
    { id: "shipped", title: "Expédiée" },
    { id: "completed", title: "Complétée" },
    { id: "cancelled", title: "Annulée" },
  ];

  // État pour gérer les colonnes et leur contenu
  const [columns, setColumns] = useState<Column[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Initialisation des colonnes avec les commandes
  useEffect(() => {
    const initialColumns = columnDefinitions.map((column) => {
      return {
        ...column,
        orders: initialOrders.filter((order) => order.status === column.id),
      };
    });
    setColumns(initialColumns);
  }, []);

  // Configuration des capteurs pour le glisser-déposer
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Gestion du début du glisser-déposer
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Trouver la commande active
    for (const column of columns) {
      const order = column.orders.find((order) => order.id === active.id);
      if (order) {
        setActiveOrder(order);
        break;
      }
    }
  };

  // Gestion de la fin du glisser-déposer
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Déterminer si nous faisons glisser entre colonnes ou à l'intérieur d'une colonne
    const activeContainer = active.data.current?.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (
      typeof activeContainer === "string" &&
      typeof overContainer === "string" &&
      activeContainer !== overContainer
    ) {
      // Déplacement entre colonnes
      setColumns((prev) => {
        const activeColumnIndex = prev.findIndex(
          (col) => col.id === activeContainer
        );
        const overColumnIndex = prev.findIndex(
          (col) => col.id === overContainer
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1) return prev;

        const activeColumn = prev[activeColumnIndex];
        const overColumn = prev[overColumnIndex];

        // Trouver la commande à déplacer
        const activeOrderIndex = activeColumn.orders.findIndex(
          (order) => order.id === activeId
        );
        if (activeOrderIndex === -1) return prev;

        // Copier la commande et mettre à jour son statut
        const orderToMove = {
          ...activeColumn.orders[activeOrderIndex],
          status: overContainer,
        };

        // Créer de nouvelles listes de commandes
        const newActiveColumnOrders = [...activeColumn.orders];
        newActiveColumnOrders.splice(activeOrderIndex, 1);

        const newOverColumnOrders = [...overColumn.orders];
        newOverColumnOrders.push(orderToMove);

        // Mettre à jour les colonnes
        const newColumns = [...prev];
        newColumns[activeColumnIndex] = {
          ...activeColumn,
          orders: newActiveColumnOrders,
        };
        newColumns[overColumnIndex] = {
          ...overColumn,
          orders: newOverColumnOrders,
        };

        console.log(
          `Commande ${orderToMove.id} mise à jour: ${orderToMove.status}`
        );
        return newColumns;
      });
    } else if (
      activeContainer === overContainer &&
      typeof activeContainer === "string"
    ) {
      // Déplacement au sein de la même colonne
      setColumns((prev) => {
        const columnIndex = prev.findIndex((col) => col.id === activeContainer);
        if (columnIndex === -1) return prev;

        const column = prev[columnIndex];
        const activeOrderIndex = column.orders.findIndex(
          (order) => order.id === activeId
        );
        const overOrderIndex = column.orders.findIndex(
          (order) => order.id === overId
        );

        if (activeOrderIndex === -1 || overOrderIndex === -1) return prev;

        // Réarranger les commandes dans la colonne
        const newOrders = arrayMove(
          column.orders,
          activeOrderIndex,
          overOrderIndex
        );

        const newColumns = [...prev];
        newColumns[columnIndex] = {
          ...column,
          orders: newOrders,
        };

        return newColumns;
      });
    }

    // Réinitialiser l'état actif
    setActiveId(null);
    setActiveOrder(null);
  };

  // Gestion des détails d'une commande
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Fonction pour obtenir la classe de style en fonction du statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900/30 text-green-400 border-green-500/30";
      case "processing":
        return "bg-blue-900/30 text-blue-400 border-blue-500/30";
      case "shipped":
        return "bg-purple-900/30 text-purple-400 border-purple-500/30";
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-900/30 text-red-400 border-red-500/30";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  return (
    <div className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-serif text-[#d4af37]">
          Gestion des Commandes - Vue Kanban
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Glissez et déposez les commandes pour modifier leur statut
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="p-4 overflow-x-auto">
          <div className="flex min-w-max gap-4 pb-4">
            {columns.map((column) => (
              <div key={column.id} className="w-80 flex-shrink-0">
                <div
                  className={`p-2 rounded-t-lg ${getStatusClass(
                    column.id
                  )} flex items-center justify-between`}
                >
                  <h3 className="font-medium">{column.title}</h3>
                  <span className="bg-black/30 text-xs px-2 py-1 rounded-full">
                    {column.orders.length}
                  </span>
                </div>

                <div
                  className={`min-h-[500px] p-2 rounded-b-lg bg-gray-800/50 border-2 border-t-0 ${getStatusClass(
                    column.id
                  )}`}
                >
                  <SortableContext
                    id={column.id}
                    items={column.orders.map((order) => order.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {column.orders.map((order) => (
                      <SortableOrder
                        key={order.id}
                        order={order}
                        expandedOrderId={expandedOrderId}
                        toggleOrderDetails={toggleOrderDetails}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeId && activeOrder ? (
            <div style={{ width: "320px" }}>
              <OrderCard
                order={activeOrder}
                expandedOrderId={expandedOrderId}
                toggleOrderDetails={toggleOrderDetails}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanOrders;
