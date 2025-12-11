import React from "react";
import type { Client } from "../../../shared/lib/client.service";
import { CustomerLogo } from "./CustomerLogo";

export interface CustomerTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void | Promise<void>;
  onNewSale?: (client: Client) => void;
  onViewActiveSales?: (client: Client) => void;
  isAdmin: boolean;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  clients,
  onEdit,
  onDelete,
  onNewSale,
  onViewActiveSales,
  isAdmin,
}: CustomerTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {clients.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            No hay clientes registrados
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <CustomerLogo />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {client.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.correo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.telefono}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {/* Botones principales - Nueva Venta y Ver Ventas */}
                    {onNewSale && (
                      <button
                        onClick={() => onNewSale(client)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                        title="Crear nueva venta"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Nueva Venta
                      </button>
                    )}
                    {onViewActiveSales && (
                      <button
                        onClick={() => onViewActiveSales(client)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-all duration-200 hover:shadow-md"
                        title="Ver ventas activas"
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                        Ventas Activas
                      </button>
                    )}
                    
                    {/* Botones secundarios - Editar y Eliminar */}
                    <div className="flex gap-1 border-l border-gray-300 pl-2 ml-1">
                      <button
                        onClick={() => onEdit(client)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs font-medium rounded-md transition-all duration-200"
                        title="Editar cliente"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(client.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 text-xs font-medium rounded-md transition-all duration-200"
                          title="Eliminar cliente"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Eliminar
                        </button>
                      )}
                    </div>
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
