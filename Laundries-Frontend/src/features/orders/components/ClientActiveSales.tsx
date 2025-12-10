import React, { useState } from "react";
import {
  getActiveSales,
  updateOrderStatus,
  cancelOrder,
  type Sale,
  type OrderItem,
} from "../../../shared/lib/order.service";
import { CancelOrderModal } from "./CancelOrderModal";

interface ClientActiveSalesProps {
  clientId: number;
  idSucursal: string;
  onClose: () => void;
}

const getStatusColor = (estado: OrderItem["estado"]) => {
  switch (estado) {
    case "RECIBIDO":
      return "bg-yellow-100 text-yellow-800";
    case "LAVANDO":
      return "bg-blue-100 text-blue-800";
    case "LISTO":
      return "bg-green-100 text-green-800";
    case "ENTREGADO":
      return "bg-gray-100 text-gray-800";
    case "CANCELADO":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const estadosDisponibles: OrderItem["estado"][] = [
  "RECIBIDO",
  "LAVANDO",
  "LISTO",
  "ENTREGADO",
];

export const ClientActiveSales: React.FC<ClientActiveSalesProps> = ({
  clientId,
  idSucursal,
  onClose,
}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    orderId: number;
    orderDetails: string;
  }>({ isOpen: false, orderId: 0, orderDetails: "" });

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveSales(idSucursal, clientId);
      setSales(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las ventas activas"
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadSales();
  }, [clientId, idSucursal]);

  const toggleSale = (saleId: string) => {
    const newExpanded = new Set(expandedSales);
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId);
    } else {
      newExpanded.add(saleId);
    }
    setExpandedSales(newExpanded);
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderItem["estado"]
  ) => {
    try {
      setError(null);
      await updateOrderStatus(orderId, newStatus);
      await loadSales();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el estado"
      );
    }
  };

  const handleCancelClick = (orderId: number, orderDetails: string) => {
    setCancelModal({
      isOpen: true,
      orderId,
      orderDetails,
    });
  };

  const handleCancelConfirm = async (codigoAutorizacion: string) => {
    await cancelOrder(cancelModal.orderId, idSucursal, codigoAutorizacion);
    await loadSales();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando ventas...</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ventas Activas</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {sales.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay ventas activas para este cliente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => {
              const isExpanded = expandedSales.has(sale.id);

              return (
                <div
                  key={sale.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSale(sale.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          Código: {sale.codigo_recogida}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(sale.fecha_recepcion).toLocaleDateString(
                            "es-ES"
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total: ${Number(sale.costo_total).toFixed(2)}
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isExpanded && sale.items && (
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Prendas ({sale.items.length})
                      </h4>
                      <div className="space-y-3">
                        {sale.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="font-medium text-gray-900">
                                  {item.numero_prendas} prenda(s)
                                </span>
                                <span className="ml-2 text-sm text-gray-600">
                                  {item.peso_kg} kg
                                </span>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  item.estado
                                )}`}
                              >
                                {item.estado}
                              </span>
                            </div>

                            {item.detalles_prendas && (
                              <p className="text-sm text-gray-600 mb-3">
                                {item.detalles_prendas}
                              </p>
                            )}

                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="text-gray-600">
                                  Precio: ${Number(item.precio_aplicado).toFixed(2)}/kg
                                </span>
                                <span className="ml-3 font-medium text-gray-900">
                                  Subtotal: ${Number(item.subtotal).toFixed(2)}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                {item.estado !== "ENTREGADO" &&
                                  item.estado !== "CANCELADO" && (
                                    <>
                                      <select
                                        value={item.estado}
                                        onChange={(e) =>
                                          handleStatusChange(
                                            item.id,
                                            e.target.value as OrderItem["estado"]
                                          )
                                        }
                                        className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      >
                                        {estadosDisponibles.map((estado) => (
                                          <option key={estado} value={estado}>
                                            {estado}
                                          </option>
                                        ))}
                                      </select>
                                      <button
                                        onClick={() =>
                                          handleCancelClick(
                                            item.id,
                                            `Orden #${item.id} - ${item.numero_prendas} prenda(s)`
                                          )
                                        }
                                        className="text-sm px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                      >
                                        Cancelar
                                      </button>
                                    </>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cancelModal.isOpen && (
        <CancelOrderModal
          isOpen={cancelModal.isOpen}
          orderId={cancelModal.orderId}
          orderDetails={cancelModal.orderDetails}
          onClose={() =>
            setCancelModal({ isOpen: false, orderId: 0, orderDetails: "" })
          }
          onConfirm={handleCancelConfirm}
        />
      )}
    </>
  );
};

