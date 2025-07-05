import React, { useState, useEffect } from "react";
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
  MeasuringStrategy,
  useDroppable,
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
import orderService from "../../services/orderService";
import type { Order as ApiOrder } from "../../types/api";
import Toast from "../common/Toast";

// Extended Order type for our Kanban board with additional statuses
interface Order extends Omit<ApiOrder, 'status'> {
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
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
  expandedOrderId: number | null;
  toggleOrderDetails: (id: number) => void;
  isDragging?: boolean;
}) => {
  // Format the date
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Format the price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  return (
    <motion.div
      className={`p-3 mb-3 rounded-lg bg-gray-900 border border-gray-700 shadow-sm cursor-grab active:cursor-grabbing hover:border-[#d4af37]/30 ${
        isDragging ? "shadow-xl ring-2 ring-[#d4af37]/30 opacity-90 rotate-1" : ""
      }`}
      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(212, 175, 55, 0.1)" }}
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
        <div className="text-[#d4af37]">{formatPrice(order.total)}</div>
      </div>

      <div className="text-sm text-gray-200">{order.name}</div>
      <div className="text-xs text-gray-400">{formatDate(order.created_at)}</div>

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
              <div className="mb-1">{order.email}</div>
              <div>{order.address}, {order.city}, {order.postal_code}</div>
            </div>

            <div className="mt-2">
              <div className="text-xs font-medium text-gray-300 mb-1">
                Produits:
              </div>
              {order.items && order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs"
                >
                  <div className="text-gray-300">
                    {item.quantity}× {item.product?.name || `Produit #${item.product_id}`}
                  </div>
                  <div className="text-[#d4af37]/80">{formatPrice(item.price)}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between text-xs">
              <div className="text-gray-400">PayPal: {order.paypal_order_id || 'N/A'}</div>
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
};  // Composant d'ordre triable
const SortableOrder = ({
  order,
  expandedOrderId,
  toggleOrderDetails,
}: {
  order: Order;
  expandedOrderId: number | null;
  toggleOrderDetails: (id: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: order.id.toString(),
    data: {
      type: 'order',
      order,
      status: order.status, // Add status to help with identifying the source column
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
    touchAction: 'none', // Prevent scrolling on touch devices when trying to drag
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="touch-none"
      data-order-id={order.id}
    >
      <OrderCard
        order={order}
        expandedOrderId={expandedOrderId}
        toggleOrderDetails={toggleOrderDetails}
        isDragging={isDragging}
      />
    </div>
  );
};

// Fonction pour obtenir la classe de style en fonction du statut
const getStatusClass = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-900/30 text-green-400 border-green-500/30";
    case "paid":
      return "bg-blue-900/30 text-blue-400 border-blue-500/30";
    // "processing" case removed
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

// KanbanColumn component with proper droppable area
const KanbanColumn = ({ 
  column, 
  activeId, 
  children 
}: { 
  column: Column, 
  activeId: string | null, 
  children: React.ReactNode 
}) => {
  // Make the column a droppable area with useDroppable
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column
    }
  });

  return (
    <div className="w-full min-w-[250px] max-w-[350px] flex-1">
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

      {/* Make each column's drop area distinct */}
      <div
        ref={setNodeRef}
        id={`column-${column.id}`} 
        data-column-id={column.id}
        className={`min-h-[500px] p-2 rounded-b-lg bg-gray-800/50 border-2 border-t-0 transition-all duration-200 ${getStatusClass(
          column.id
        )} ${activeId && activeId !== 'placeholder' ? 'bg-opacity-70' : ''} ${
          isOver ? 'border-dashed border-[#d4af37] bg-opacity-30' : ''
        }`}
      >
        {children}
        
        {column.orders.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            <p>Aucune commande dans cette colonne</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant principal Kanban
const KanbanOrders: React.FC = () => {
  // Définition des colonnes et leur mappage avec les statuts de l'API
  const columnDefinitions = [
    { id: "pending", title: "En attente" },
    { id: "paid", title: "Payée" }, 
    { id: "shipped", title: "Expédiée" },
    { id: "completed", title: "Complétée" },
    { id: "cancelled", title: "Annulée" }
  ];

  // État pour gérer les colonnes et leur contenu
  const [kanbanColumns, setKanbanColumns] = useState<Column[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  // États pour gérer le chargement et les erreurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fonction pour mapper l'état de l'API aux états du Kanban
  const mapApiStatusToKanban = (apiOrder: ApiOrder): Order => {
    // Map status or use default
    let kanbanStatus: Order['status'] = 'pending';
    
    // Direct mapping for existing statuses
    if (apiOrder.status === 'pending' || apiOrder.status === 'paid' || apiOrder.status === 'shipped' || apiOrder.status === 'completed' || apiOrder.status === 'cancelled') {
      kanbanStatus = apiOrder.status;
    }
    
    // For demo/compatibility, we'll map some orders to other statuses
    // In a real app, you would update the backend to support these statuses
    // "processing" status is no longer used
    if (apiOrder.id % 7 === 0) kanbanStatus = 'completed'; 
    if (apiOrder.id % 11 === 0) kanbanStatus = 'cancelled';
    
    return {
      ...apiOrder,
      status: kanbanStatus
    };
  };

  // Fonction pour convertir le statut Kanban en statut API
  const getBackendStatus = (kanbanStatus: string): string => {
    // Map Kanban status to backend status
    switch (kanbanStatus) {
      // "processing" case removed
      case 'completed': return 'paid';
      case 'cancelled': return 'pending';
      default: return kanbanStatus;
    }
  };

  // Récupérer les commandes depuis l'API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const apiData = await orderService.getAllOrders();
        
        // Convert API orders to our Kanban order format
        const kanbanOrders = apiData.map(mapApiStatusToKanban);
        
        // Initialisation des colonnes avec les commandes
        const initialColumns = columnDefinitions.map((column) => {
          return {
            ...column,
            orders: kanbanOrders.filter((order) => order.status === column.id),
          };
        });
        
        setKanbanColumns(initialColumns);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des commandes. Veuillez réessayer.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Configuration des capteurs pour le glisser-déposer
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Optimized for better response on both touch and mouse
      activationConstraint: {
        distance: 3, // Small threshold to start dragging (px)
        tolerance: 5, // Tolerance for slight movements
        delay: 0, // No delay in activation
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

    // Use the data from the sortable element if available
    if (active.data?.current?.order) {
      setActiveOrder(active.data.current.order);
      return;
    }

    // Fallback: find the order in columns
    for (const column of kanbanColumns) {
      const order = column.orders.find((order) => order.id.toString() === active.id);
      if (order) {
        setActiveOrder(order);
        break;
      }
    }
  };

  // Gestion de la fin du glisser-déposer
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id.toString();
    
    // Find the dragged order
    let draggedOrder: Order | null = null;
    let sourceColumnId: string = '';
    
    // Find the source column and dragged order
    for (const column of kanbanColumns) {
      const order = column.orders.find(order => order.id.toString() === activeId);
      if (order) {
        draggedOrder = order;
        sourceColumnId = column.id;
        break;
      }
    }
    
    if (!draggedOrder) {
      console.error("Could not find the dragged order");
      return;
    }
    
    // Determine target column
    let targetColumnId: string = '';
    
    // Check if we're directly over a column container using the data from useDroppable
    if (over.data.current?.type === 'column') {
      // We're directly over a droppable column
      targetColumnId = over.id.toString();
      console.log(`Dropping directly onto column: ${targetColumnId}`);
    } else {
      // Check if we're over a sortable item and find its container
      const overDataColumnId = (over.data.current as any)?.sortable?.containerId;
      if (overDataColumnId) {
        targetColumnId = overDataColumnId;
        console.log(`Dropping onto an order in column: ${targetColumnId}`);
      } else {
        // Fallback: if over an order, find which column contains that order
        const overId = over.id.toString();
        for (const column of kanbanColumns) {
          if (column.orders.some(order => order.id.toString() === overId)) {
            targetColumnId = column.id;
            break;
          }
        }
      }
    }
    
    // If we couldn't determine a target column, do nothing
    if (!targetColumnId) {
      console.error("Could not determine target column");
      return;
    }
    
    console.log(`Moving order #${draggedOrder.id} from ${sourceColumnId} to ${targetColumnId}`);
    
    // If source and target columns are different, update the order status
    if (sourceColumnId !== targetColumnId) {
      try {
        setIsUpdating(true);
        
        // Map Kanban status to backend status
        const newBackendStatus = getBackendStatus(targetColumnId);
        
        // Update the status in the backend
        await orderService.updateOrderStatus(draggedOrder.id, newBackendStatus);
        
        // Update the local state
        setKanbanColumns(prevColumns => {
          // Create new array to ensure React re-renders
          return prevColumns.map(column => {
            // Remove from source column
            if (column.id === sourceColumnId) {
              return {
                ...column,
                orders: column.orders.filter(order => order.id !== draggedOrder!.id)
              };
            }
            
            // Add to target column
            if (column.id === targetColumnId) {
              // Create copy of the order with updated status
              const updatedOrder: Order = {
                ...draggedOrder!,
                status: targetColumnId as Order['status']
              };
              
              return {
                ...column,
                orders: [...column.orders, updatedOrder]
              };
            }
            
            // Leave other columns unchanged
            return column;
          });
        });
        
        // Find target column title for the success message
        const targetColumn = kanbanColumns.find(col => col.id === targetColumnId);
        if (targetColumn) {
          setToastMessage(`Statut de la commande #${draggedOrder.id} mis à jour vers ${targetColumn.title}`);
          setShowToast(true);
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        setToastMessage('Erreur lors de la mise à jour du statut de la commande.');
        setShowToast(true);
        
        // Refresh orders in case of error
        refreshOrders();
      } finally {
        setIsUpdating(false);
      }
    } else if (sourceColumnId === targetColumnId) {
      // Reordering within the same column
      const overId = over.id.toString();
      setKanbanColumns(prevColumns => {
        return prevColumns.map(column => {
          if (column.id === sourceColumnId) {
            const orders = [...column.orders];
            const activeIndex = orders.findIndex(order => order.id.toString() === activeId);
            const overIndex = orders.findIndex(order => order.id.toString() === overId);
            
            if (activeIndex !== -1 && overIndex !== -1) {
              return {
                ...column,
                orders: arrayMove(orders, activeIndex, overIndex)
              };
            }
          }
          return column;
        });
      });
    }

    // Reset active states
    setActiveId(null);
    setActiveOrder(null);
  };
  
  // Fonction pour rafraîchir les commandes
  const refreshOrders = async () => {
    try {
      setLoading(true);
      const apiData = await orderService.getAllOrders();
      
      // Convert API orders to our Kanban order format
      const kanbanOrders = apiData.map(mapApiStatusToKanban);
      
      // Initialisation des colonnes avec les commandes
      const initialColumns = columnDefinitions.map((column) => {
        return {
          ...column,
          orders: kanbanOrders.filter((order) => order.status === column.id),
        };
      });
      
      setKanbanColumns(initialColumns);
      setError(null);
    } catch (err) {
      setError("Erreur lors du rafraîchissement des commandes.");
      console.error("Error refreshing orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gestion des détails d'une commande
  const toggleOrderDetails = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
      
      // Si l'ordre est développé, récupérez les détails complets
      try {
        const apiDetailedOrder = await orderService.getOrder(orderId);
        
        // Conserver le statut Kanban actuel tout en récupérant les détails de l'API
        // Trouver l'ordre dans les colonnes existantes pour obtenir le statut Kanban
        let currentKanbanStatus: Order['status'] = 'pending';
        for (const column of kanbanColumns) {
          const existingOrder = column.orders.find(o => o.id === orderId);
          if (existingOrder) {
            currentKanbanStatus = existingOrder.status;
            break;
          }
        }
        
        // Créer l'ordre mis à jour avec le statut Kanban et les détails de l'API
        const detailedOrder: Order = {
          ...apiDetailedOrder,
          status: currentKanbanStatus
        };
        
        // Mettre à jour l'ordre dans les colonnes
        setKanbanColumns((prev) => {
          return prev.map((column) => {
            return {
              ...column,
              orders: column.orders.map((order) => 
                order.id === orderId ? detailedOrder : order
              ),
            };
          });
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la commande:", error);
        setToastMessage("Erreur lors de la récupération des détails de la commande");
        setShowToast(true);
      }
    }
  };

  // Note: getStatusClass is now defined outside of this component

  return (
    <div className="bg-gray-900 border border-[#d4af37]/10 rounded-xl shadow-lg shadow-[#d4af37]/5">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif text-[#d4af37]">
            Gestion des Commandes - Vue Kanban
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Glissez et déposez les commandes pour modifier leur statut
          </p>
        </div>
        
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
      
      {/* Affichage du toast pour les messages */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      {/* Affichage de l'erreur */}
      {error && (
        <div className="p-6 bg-red-900/20 border border-red-800 rounded-md m-6">
          <p className="text-red-400">{error}</p>
          <button 
            className="mt-2 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={refreshOrders}
          >
            Réessayer
          </button>
        </div>
      )}
      
      {/* Affichage du chargement */}
      {loading && !error && (
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d4af37] mr-2"></div>
          <span className="text-gray-300">Chargement des commandes...</span>
        </div>
      )}

      {!loading && !error && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[
            // Restrict movements to horizontal to help with column to column dragging
            (args) => {
              if (args.draggingNodeRect && args.transform.x && Math.abs(args.transform.x) > 200) {
                // Restrict vertical movement when moving between columns
                return {
                  ...args.transform,
                  y: args.transform.y * 0.2 // Dampen vertical movement
                };
              }
              return args.transform;
            }
          ]}
        >
          <div className="p-4 overflow-x-auto">
            <div className="flex min-w-max gap-4 pb-4 w-full justify-between">
              {kanbanColumns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  activeId={activeId}
                >
                  <SortableContext
                    id={column.id}
                    items={column.orders.map((order: Order) => order.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    {column.orders.map((order: Order) => (
                      <SortableOrder
                        key={order.id}
                        order={order}
                        expandedOrderId={expandedOrderId}
                        toggleOrderDetails={toggleOrderDetails}
                      />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              ))}
            </div>
          </div>

          <DragOverlay adjustScale={true} dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeId && activeOrder ? (
              <div style={{ width: "320px", transform: "rotate(-2deg)" }}>
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
      )}
      
      {/* Indicateur de mise à jour en cours */}
      {isUpdating && (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-[#d4af37]/30 rounded-lg px-4 py-3 shadow-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#d4af37] mr-2"></div>
            <span className="text-[#d4af37]">Mise à jour de la commande en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanOrders;
