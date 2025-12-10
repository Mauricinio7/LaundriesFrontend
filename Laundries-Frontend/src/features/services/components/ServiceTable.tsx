import React from "react";
import type { Service } from "../../../shared/lib/service.service";

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {services.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            No hay servicios registrados
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Precio por Kilo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {service.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {service.descripcion}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ${Number(service.precio_por_kilo).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(service.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

