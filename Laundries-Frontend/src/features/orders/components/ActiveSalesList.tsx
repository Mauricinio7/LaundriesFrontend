import React, { useState } from "react";
import { getSaleDetails, type Sale, type OrderItem } from "../../../shared/lib/order.service";

interface ActiveSalesListProps {
  sales: Sale[];
  loading: boolean;
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

export const ActiveSalesList: React.FC<ActiveSalesListProps> = ({
  sales,
  loading,
}) => {
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());
  const [saleDetails, setSaleDetails] = useState<Record<string, Sale>>({});
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());

  const toggleSale = async (saleId: string) => {
    if (expandedSales.has(saleId)) {
      // Cerrar
      const newExpanded = new Set(expandedSales);
      newExpanded.delete(saleId);
      setExpandedSales(newExpanded);
    } else {
      // Abrir y cargar detalles si no están cargados
      setExpandedSales(new Set([...expandedSales, saleId]));
      
      if (!saleDetails[saleId]) {
        setLoadingDetails(new Set([...loadingDetails, saleId]));
        try {
          const details = await getSaleDetails(saleId);
          setSaleDetails((prev) => ({ ...prev, [saleId]: details }));
        } catch (error) {
          console.error("Error al cargar detalles:", error);
        } finally {
          setLoadingDetails((prev) => {
            const newSet = new Set(prev);
            newSet.delete(saleId);
            return newSet;
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando ventas...</span>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No hay ventas activas en este momento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sales.map((sale) => {
        const isExpanded = expandedSales.has(sale.id);
        const details = saleDetails[sale.id] || sale;
        const isLoadingDetails = loadingDetails.has(sale.id);

        return (
          <div
            key={sale.id}
            className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleSale(sale.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-900">
                    Código: {sale.codigo_recogida}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(sale.fecha_recepcion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Total: ${Number(sale.costo_total).toFixed(2)}
                </div>
                {sale.items && sale.items.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sale.items.map((item) => (
                      <span
                        key={item.id}
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          item.estado
                        )}`}
                      >
                        {item.estado}
                      </span>
                    ))}
                  </div>
                )}
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

            {isExpanded && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                {isLoadingDetails ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Cargando detalles...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {details.items && details.items.length > 0 ? (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Prendas ({details.items.length})
                        </h4>
                        <div className="space-y-3">
                          {details.items.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex justify-between items-start mb-2">
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
                                <p className="text-sm text-gray-600 mt-2">
                                  {item.detalles_prendas}
                                </p>
                              )}
                              <div className="mt-2 flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Precio: ${Number(item.precio_aplicado).toFixed(2)}/kg
                                </span>
                                <span className="font-medium text-gray-900">
                                  Subtotal: ${Number(item.subtotal).toFixed(2)}
                                </span>
                              </div>
                              {item.fecha_entrega_estimada && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Entrega estimada:{" "}
                                  {new Date(
                                    item.fecha_entrega_estimada
                                  ).toLocaleDateString("es-ES")}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No hay items en esta venta</p>
                    )}
                    {details.anotaciones_generales && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Anotaciones
                        </h4>
                        <p className="text-sm text-gray-600">
                          {details.anotaciones_generales}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

