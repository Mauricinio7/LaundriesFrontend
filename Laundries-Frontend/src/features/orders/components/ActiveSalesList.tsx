import React, { useState, useEffect } from "react";
import { getSaleDetails, type Sale, type OrderItem } from "../../../shared/lib/order.service";
import { getClient, type Client } from "../../../shared/lib/client.service";
import { getEmployeesBySucursal, type Employee } from "../../../shared/lib/employee.service";

export interface ActiveSalesListProps {
  sales: Sale[];
  loading: boolean;
  idSucursal: string | null;
  hideEmployeeInfo?: boolean; // Para ocultar "Atendido por" cuando es para empleados
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
  idSucursal,
  hideEmployeeInfo = false,
}: ActiveSalesListProps) => {
  const [expandedSales, setExpandedSales] = useState<Set<string>>(new Set());
  const [saleDetails, setSaleDetails] = useState<Record<string, Sale>>({});
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());
  
  // Estados para datos humanos
  const [clients, setClients] = useState<Record<number, Client>>({});
  const [employees, setEmployees] = useState<Record<string, Employee>>({});
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Cargar empleados al montar (solo si no está oculto)
  useEffect(() => {
    if (idSucursal && !hideEmployeeInfo) {
      loadEmployees();
    }
  }, [idSucursal, hideEmployeeInfo]);

  // Cargar clientes cuando cambien las ventas
  useEffect(() => {
    if (sales.length > 0) {
      loadClients();
    }
  }, [sales]);

  const loadEmployees = async () => {
    if (!idSucursal) return;

    try {
      setLoadingEmployees(true);
      const employeesList = await getEmployeesBySucursal(idSucursal);
      const employeesMap: Record<string, Employee> = {};
      employeesList.forEach((emp) => {
        employeesMap[emp.id] = emp;
      });
      setEmployees(employeesMap);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      // Extraer IDs únicos de clientes
      const uniqueClientIds = [
        ...new Set(sales.map((sale) => sale.id_cliente)),
      ].filter((id) => id && !clients[id]);

      if (uniqueClientIds.length === 0) return;

      // Cargar todos los clientes en paralelo
      const clientPromises = uniqueClientIds.map((id) => getClient(id));
      const clientsData = await Promise.all(clientPromises);

      // Crear mapa de clientes
      const clientsMap: Record<number, Client> = { ...clients };
      clientsData.forEach((client) => {
        clientsMap[client.id] = client;
      });

      setClients(clientsMap);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoadingClients(false);
    }
  };

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
        const client = clients[sale.id_cliente];
        const employee = employees[sale.id_empleado];

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
                {/* Header: Nombre Cliente | Código */}
                <div className="flex items-center gap-3 mb-2">
                  {client ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-semibold text-gray-900">
                        {client.nombre}
                      </span>
                    </div>
                  ) : loadingClients ? (
                    <span className="text-sm text-gray-400">Cargando...</span>
                  ) : (
                    <span className="text-sm text-gray-400">Cliente #{sale.id_cliente}</span>
                  )}
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold text-gray-700">
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

                {/* Body: Estados de items */}
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

            {/* Footer: Total | Atendido por (solo si no está oculto) */}
            <div className={`border-t border-gray-200 px-6 py-3 bg-gray-50 flex ${hideEmployeeInfo ? 'justify-start' : 'justify-between'} items-center text-sm`}>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900">
                  Total: ${Number(sale.costo_total).toFixed(2)}
                </span>
              </div>
              {!hideEmployeeInfo && (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Atendido por:{" "}
                    {employee ? (
                      <span className="font-medium text-gray-900">
                        {employee.nombre}
                      </span>
                    ) : loadingEmployees ? (
                      <span className="text-gray-400">Cargando...</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </span>
                </div>
              )}
            </div>

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
