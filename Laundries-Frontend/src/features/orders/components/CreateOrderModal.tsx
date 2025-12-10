import React, { useState, useEffect } from "react";
import { getAllActiveServices, type Service } from "../../../shared/lib/service.service";
import { createOrder, type CreateOrderData } from "../../../shared/lib/order.service";
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

  useEffect(() => {
    if (isOpen) {
      loadServices();
    }
  }, [isOpen]);

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

      await createOrder(orderData);
      onSuccess();
      handleClose();
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
    onClose();
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
    </div>
  );
};

