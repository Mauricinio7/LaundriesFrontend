import React, { useState, useEffect } from "react";
import {
  getSaleDetails,
  type Sale,
  type OrderItem,
} from "../../../shared/lib/order.service";
import { getClient, type Client } from "../../../shared/lib/client.service";
import {
  getEmployeesBySucursal,
  type Employee,
} from "../../../shared/lib/employee.service";
import {
  getAllActiveServices,
  type Service,
} from "../../../shared/lib/service.service";
import { getBranchById } from "../../../shared/lib/branch.service";
import {
  generateTicketPDF,
  type TicketData,
} from "../../../shared/lib/pdf.service";

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

// ✅ Parsear anotaciones con el formato: "Pago: X ; -- notas..."
const parsePaymentNotes = (raw?: string | null) => {
  const text = (raw ?? "").trim();
  if (!text) return { paymentMethod: null as string | null, extraNotes: "" };

  // Separa por ";--" con tolerancia a espacios: "; --", " ;-- ", etc.
  const parts = text.split(/\s*;\s*--\s*/);

  const left = (parts[0] ?? "").trim(); // "Pago: Efectivo" (idealmente)
  const right = (parts.slice(1).join(" ; -- ") ?? "").trim(); // resto (por si vienen más separadores)

  // Extraer método de pago si viene como "Pago: ..."
  const paymentMatch = left.match(/^Pago:\s*(.+)$/i);
  const paymentMethod = paymentMatch ? paymentMatch[1].trim() : null;

  // Si no viene "Pago:" entonces tratamos todo como notas
  if (!paymentMethod) {
    return { paymentMethod: null, extraNotes: text };
  }

  return { paymentMethod, extraNotes: right };
};

// ✅ Parsear detalles de prendas con bloque INITCLOTHES/ENDCLOTHES
// - clothes: lista de "Tipo : detalle"
// - extra: SOLO lo que viene después de ENDCLOTHES (si existe)
const parseClothesDetails = (raw?: string | null) => {
  const text = (raw ?? "").trim();
  if (!text) return { clothes: [] as string[], extra: "" };

  const start = text.search(/INITCLOTHES\s*:/i);
  const end = text.search(/ENDCLOTHES/i);

  // Si no hay bloque, todo lo tratamos como "extra"
  if (start === -1 || end === -1 || end <= start) {
    return { clothes: [] as string[], extra: text };
  }

  // Parte dentro del bloque
  const afterInit = text
    .slice(start)
    .replace(/^[\s\S]*?INITCLOTHES\s*:\s*/i, "");
  const inside = afterInit.replace(/ENDCLOTHES[\s\S]*$/i, "").trim();

  const clothes = inside
    .split(/\s*;\s*--\s*/)
    .map((p) => p.replace(/[\r\n]+/g, " ").trim())
    .filter(Boolean);

  // ✅ SOLO lo que viene después de ENDCLOTHES
  const extra = text
    .slice(end)
    .replace(/^ENDCLOTHES\s*/i, "")
    .trim();

  return { clothes, extra };
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
  const [services, setServices] = useState<Record<number, Service>>({});
  const [branches, setBranches] = useState<Record<string, string>>({});
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // Cargar empleados al montar (solo si no está oculto)
  useEffect(() => {
    if (idSucursal && !hideEmployeeInfo) {
      loadEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSucursal, hideEmployeeInfo]);

  // Cargar servicios al montar
  useEffect(() => {
    loadServices();
  }, []);

  // Cargar clientes cuando cambien las ventas
  useEffect(() => {
    if (sales.length > 0) {
      loadClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const uniqueClientIds = [
        ...new Set(sales.map((sale) => sale.id_cliente)),
      ].filter((id) => id && !clients[id]);

      if (uniqueClientIds.length === 0) return;

      const clientPromises = uniqueClientIds.map((id) => getClient(id));
      const clientsData = await Promise.all(clientPromises);

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

  const loadServices = async () => {
    try {
      const servicesList = await getAllActiveServices();
      const servicesMap: Record<number, Service> = {};
      servicesList.forEach((service) => {
        servicesMap[service.id] = service;
      });
      setServices(servicesMap);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  const loadBranchName = async (branchId: string | number) => {
    if (branches[String(branchId)]) return branches[String(branchId)];

    try {
      const branch = await getBranchById(String(branchId));
      setBranches((prev) => ({ ...prev, [String(branchId)]: branch.nombre }));
      return branch.nombre;
    } catch (error) {
      console.error("Error al cargar nombre de la sucursal:", error);
      return `Sucursal ${branchId}`;
    }
  };

  const handleDownloadTicket = async (sale: Sale) => {
    try {
      let saleData = sale;
      if (!sale.items || sale.items.length === 0) {
        saleData = await getSaleDetails(sale.id);
      }

      const client = clients[saleData.id_cliente];
      const employee = employees[saleData.id_empleado] || { nombre: "N/A" };

      const branchName = await loadBranchName(saleData.id_sucursal);

      const ticketData: TicketData = {
        codigo: saleData.codigo_recogida,
        fecha: saleData.fecha_recepcion,
        clienteNombre: client?.nombre || `Cliente #${saleData.id_cliente}`,
        clienteTelefono: client?.telefono,
        sucursalNombre: branchName,
        empleadoNombre: employee.nombre || "N/A",
        items: (saleData.items || []).map((item) => {
          const service = services[item.id_servicio];
          return {
            servicio: service?.nombre || `Servicio #${item.id_servicio}`,
            peso: item.peso_kg,
            numeroPrendas: item.numero_prendas,
            precio: Number(item.precio_aplicado),
            subtotal: Number(item.subtotal),
            detalles: item.detalles_prendas,
            fechaEntrega: item.fecha_entrega_estimada,
          };
        }),
        total: Number(saleData.costo_total),
        anotaciones: saleData.anotaciones_generales,
      };

      generateTicketPDF(ticketData);
    } catch (error) {
      console.error("Error al generar ticket:", error);
      alert("Error al generar el ticket. Por favor, intente nuevamente.");
    }
  };

  const toggleSale = async (saleId: string) => {
    if (expandedSales.has(saleId)) {
      const newExpanded = new Set(expandedSales);
      newExpanded.delete(saleId);
      setExpandedSales(newExpanded);
      return;
    }

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

        const { paymentMethod, extraNotes } = parsePaymentNotes(
          details.anotaciones_generales,
        );

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
                    <span className="text-sm text-gray-400">
                      Cliente #{sale.id_cliente}
                    </span>
                  )}
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold text-gray-700">
                    Código: {sale.codigo_recogida}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(sale.fecha_recepcion).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>

                {sale.items && sale.items.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sale.items.map((item) => (
                      <span
                        key={item.id}
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          item.estado,
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

            <div
              className={`border-t border-gray-200 px-6 py-3 bg-gray-50 flex ${
                hideEmployeeInfo ? "justify-between" : "justify-between"
              } items-center text-sm gap-3`}
            >
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

              <div className="flex items-center gap-3">
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

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadTicket(sale);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                  title="Descargar ticket PDF"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Ticket
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                {isLoadingDetails ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">
                      Cargando detalles...
                    </span>
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
                                    item.estado,
                                  )}`}
                                >
                                  {item.estado}
                                </span>
                              </div>

                              {item.detalles_prendas &&
                                (() => {
                                  const { clothes, extra } =
                                    parseClothesDetails(item.detalles_prendas);

                                  return (
                                    <div className="mt-2 space-y-2">
                                      {clothes.length > 0 && (
                                        <div>
                                          <p className="text-xs font-medium text-gray-700 mb-1">
                                            Prendas:
                                          </p>
                                          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                            {clothes.map((c, idx) => (
                                              <li key={idx}>{c}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      <div>
                                        <p className="text-xs font-medium text-gray-700 mb-1">
                                          Notas extra:
                                        </p>
                                        {extra ? (
                                          <p className="text-sm text-gray-600 whitespace-pre-line">
                                            {extra}
                                          </p>
                                        ) : (
                                          <p className="text-sm text-gray-400">
                                            (Sin notas extra)
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}

                              <div className="mt-2 flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Precio: $
                                  {Number(item.precio_aplicado).toFixed(2)}/kg
                                </span>
                                <span className="font-medium text-gray-900">
                                  Subtotal: ${Number(item.subtotal).toFixed(2)}
                                </span>
                              </div>

                              {item.fecha_entrega_estimada && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Entrega estimada:{" "}
                                  {new Date(
                                    item.fecha_entrega_estimada,
                                  ).toLocaleDateString("es-ES")}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        No hay items en esta venta
                      </p>
                    )}

                    {details.anotaciones_generales && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Anotaciones
                        </h4>

                        {paymentMethod && (
                          <p className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">Método de pago:</span>{" "}
                            {paymentMethod}
                          </p>
                        )}

                        {extraNotes ? (
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {extraNotes}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400">
                            (Sin notas adicionales)
                          </p>
                        )}
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
