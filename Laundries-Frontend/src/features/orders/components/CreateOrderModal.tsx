import React, { useState, useEffect } from "react";
import { getAllActiveServices, type Service } from "../../../shared/lib/service.service";
import { createOrder, type CreateOrderData, type Sale } from "../../../shared/lib/order.service";
import { getEmployeesBySucursal, type Employee } from "../../../shared/lib/employee.service";
import { getBranchById } from "../../../shared/lib/branch.service";
import { generateTicketPDF, type TicketData } from "../../../shared/lib/pdf.service";
import type { Client } from "../../../shared/lib/client.service";

interface CreateOrderModalProps {
  isOpen: boolean;
  client: Client;
  idSucursal: string;
  idEmpleado: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderItem {
  idServicio: number;
  pesoKg: number;
  numeroPrendas: number;
  detalles: string;
  fechaEntrega: string;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  client,
  idSucursal,
  idEmpleado,
  onClose,
  onSuccess,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [items, setItems] = useState<OrderItem[]>([
    {
      idServicio: 0,
      pesoKg: 0,
      numeroPrendas: 0,
      detalles: "",
      fechaEntrega: "",
    },
  ]);
  const [anotaciones, setAnotaciones] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Sale | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [savedFormItems, setSavedFormItems] = useState<OrderItem[]>([]); // Guardar items del formulario

  useEffect(() => {
    if (isOpen) {
      loadServices();
      loadEmployeeName();
      loadBranchName();
    }
  }, [isOpen, idSucursal, idEmpleado]);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const activeServices = await getAllActiveServices();
      setServices(activeServices);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los servicios"
      );
    } finally {
      setLoadingServices(false);
    }
  };

  const loadEmployeeName = async () => {
    if (!idSucursal || !idEmpleado) return;
    try {
      const employees = await getEmployeesBySucursal(idSucursal);
      const employee = employees.find((emp) => String(emp.id) === String(idEmpleado));
      if (employee) {
        setEmployeeName(employee.nombre);
      }
    } catch (err) {
      console.error("Error al cargar nombre del empleado:", err);
    }
  };

  const loadBranchName = async () => {
    if (!idSucursal) return;
    try {
      const branch = await getBranchById(idSucursal);
      setBranchName(branch.nombre);
    } catch (err) {
      console.error("Error al cargar nombre de la sucursal:", err);
      setBranchName(`Sucursal ${idSucursal}`); // Fallback
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        idServicio: 0,
        pesoKg: 0,
        numeroPrendas: 0,
        detalles: "",
        fechaEntrega: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const validateForm = (): boolean => {
    if (items.length === 0) {
      setError("Debes agregar al menos un item");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.idServicio || item.idServicio === 0) {
        setError(`El item ${i + 1} debe tener un servicio seleccionado`);
        return false;
      }
      if (item.pesoKg <= 0) {
        setError(`El item ${i + 1} debe tener un peso mayor a 0`);
        return false;
      }
      if (item.numeroPrendas <= 0) {
        setError(`El item ${i + 1} debe tener al menos una prenda`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData: CreateOrderData = {
        idCliente: client.id,
        idSucursal,
        idEmpleado,
        anotaciones: anotaciones.trim() || undefined,
        items: items.map((item) => ({
          idServicio: item.idServicio,
          pesoKg: item.pesoKg,
          numeroPrendas: item.numeroPrendas,
          detalles: item.detalles.trim() || undefined,
          fechaEntrega: item.fechaEntrega || undefined,
        })),
      };

      // Guardar items del formulario antes de crear la orden (copia profunda)
      const formItemsCopy = items.map(item => ({ ...item }));
      setSavedFormItems(formItemsCopy);
      
      const newOrder = await createOrder(orderData);
      
      // Construir items desde el formulario siempre (más confiable)
      const servicesMap: Record<number, Service> = {};
      services.forEach((service) => {
        servicesMap[service.id] = service;
      });
      
      // Construir items desde el formulario
      const constructedItems = formItemsCopy.map((item) => {
        const service = servicesMap[item.idServicio];
        const precio = Number(service?.precio_por_kilo || 0);
        return {
          id: 0, // Temporal, se asignará cuando se obtengan los detalles
          id_venta: newOrder.id,
          id_servicio: item.idServicio,
          numero_prendas: item.numeroPrendas,
          peso_kg: item.pesoKg,
          precio_aplicado: precio,
          subtotal: precio * item.pesoKg,
          detalles_prendas: item.detalles || undefined,
          estado: "RECIBIDO" as const,
          fecha_entrega_estimada: item.fechaEntrega || undefined,
        };
      });
      
      // Si la orden incluye items del backend, usarlos; si no, usar los construidos
      let orderWithItems = newOrder;
      if (!newOrder.items || newOrder.items.length === 0) {
        // Esperar un momento para que el backend procese
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          const { getSaleDetails } = await import("../../../shared/lib/order.service");
          const details = await getSaleDetails(newOrder.id);
          // Si los detalles tienen items, usarlos; si no, usar los construidos
          if (details.items && details.items.length > 0) {
            orderWithItems = details;
          } else {
            orderWithItems = {
              ...newOrder,
              items: constructedItems,
            };
          }
        } catch (err) {
          console.error("Error al obtener detalles de la venta:", err);
          // Usar items construidos desde el formulario
          orderWithItems = {
            ...newOrder,
            items: constructedItems,
          };
        }
      }
      
      setCreatedOrder(orderWithItems);
      setShowSuccessModal(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la orden"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setItems([
      {
        idServicio: 0,
        pesoKg: 0,
        numeroPrendas: 0,
        detalles: "",
        fechaEntrega: "",
      },
    ]);
    setAnotaciones("");
    setError(null);
    setCreatedOrder(null);
    setShowSuccessModal(false);
    setSavedFormItems([]);
    onClose();
  };

  const handleDownloadTicket = async () => {
    if (!createdOrder) return;

    // Asegurarse de tener los items completos
    let orderWithItems = createdOrder;
    if (!createdOrder.items || createdOrder.items.length === 0) {
      try {
        const { getSaleDetails } = await import("../../../shared/lib/order.service");
        orderWithItems = await getSaleDetails(createdOrder.id);
      } catch (err) {
        console.error("Error al obtener detalles:", err);
        // Si falla, construir desde los items guardados del formulario
        const servicesMap: Record<number, Service> = {};
        services.forEach((service) => {
          servicesMap[service.id] = service;
        });
        
        const formItems = savedFormItems.length > 0 ? savedFormItems : items;
        orderWithItems = {
          ...createdOrder,
          items: formItems.map((item) => {
            const service = servicesMap[item.idServicio];
            const precio = Number(service?.precio_por_kilo || 0);
            return {
              id: 0,
              id_venta: createdOrder.id,
              id_servicio: item.idServicio,
              numero_prendas: item.numeroPrendas,
              peso_kg: item.pesoKg,
              precio_aplicado: precio,
              subtotal: precio * item.pesoKg,
              detalles_prendas: item.detalles || undefined,
              estado: "RECIBIDO" as const,
              fecha_entrega_estimada: item.fechaEntrega || undefined,
            };
          }),
        };
      }
    }

    // Crear mapa de servicios para buscar nombres
    const servicesMap: Record<number, Service> = {};
    services.forEach((service) => {
      servicesMap[service.id] = service;
    });

    // Construir datos del ticket
    const ticketData: TicketData = {
      codigo: orderWithItems.codigo_recogida,
      fecha: orderWithItems.fecha_recepcion,
      clienteNombre: client.nombre,
      clienteTelefono: client.telefono,
      sucursalNombre: branchName || `Sucursal ${idSucursal}`,
      empleadoNombre: employeeName || "Empleado",
      items: (orderWithItems.items || []).map((item) => {
        const service = servicesMap[item.id_servicio];
        return {
          servicio: service?.nombre || `Servicio #${item.id_servicio}`,
          peso: Number(item.peso_kg),
          numeroPrendas: item.numero_prendas,
          precio: Number(item.precio_aplicado),
          subtotal: Number(item.subtotal),
          detalles: item.detalles_prendas,
          fechaEntrega: item.fecha_entrega_estimada,
        };
      }),
      total: Number(orderWithItems.costo_total),
      anotaciones: orderWithItems.anotaciones_generales,
    };

    // Validar que hay items antes de generar
    if (ticketData.items.length === 0) {
      console.error("No hay items para el ticket:", {
        orderWithItems,
        savedFormItems,
        items,
        services,
      });
      alert("Error: No se pudieron cargar los items de la orden. Por favor, intente descargar el ticket desde la lista de ventas activas.");
      return;
    }

    console.log("Generando ticket con items:", ticketData.items);
    generateTicketPDF(ticketData);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedOrder(null);
    onSuccess();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Nueva Venta
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cliente: {client.nombre} - {client.correo}
              </p>
            </div>
            <button
              onClick={handleClose}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anotaciones Generales
              </label>
              <textarea
                value={anotaciones}
                onChange={(e) => setAnotaciones(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Anotaciones adicionales para esta venta..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Items de la Orden
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                >
                  + Agregar Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-700">
                        Item {index + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Servicio *
                        </label>
                        <select
                          value={item.idServicio}
                          onChange={(e) =>
                            updateItem(index, "idServicio", Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value={0}>Seleccionar servicio</option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.nombre} - ${Number(service.precio_por_kilo).toFixed(2)}/kg
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Peso (kg) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.pesoKg}
                          onChange={(e) =>
                            updateItem(index, "pesoKg", Number(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Prendas *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.numeroPrendas}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "numeroPrendas",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Entrega Estimada
                        </label>
                        <input
                          type="date"
                          value={item.fechaEntrega}
                          onChange={(e) =>
                            updateItem(index, "fechaEntrega", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Detalles de las Prendas
                        </label>
                        <textarea
                          value={item.detalles}
                          onChange={(e) =>
                            updateItem(index, "detalles", e.target.value)
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Ropa color, tipo de prenda, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loadingServices}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creando..." : "Crear Venta"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de éxito con opción de descargar ticket */}
      {showSuccessModal && createdOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Venta creada exitosamente!
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Código de recogida: <span className="font-bold">{createdOrder.codigo_recogida}</span>
              </p>
              <p className="text-sm text-gray-500">
                Total: ${Number(createdOrder.costo_total).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSuccessModalClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleDownloadTicket}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Descargar Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

