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
                <td className="px-6 py-4 text-sm text-gray-900">
                  {client.nombre}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.correo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.telefono}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {onNewSale && (
                        <button
                          onClick={() => onNewSale(client)}
                          className="text-sm px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Nueva Venta
                        </button>
                      )}
                      {onViewActiveSales && (
                        <button
                          onClick={() => onViewActiveSales(client)}
                          className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Ver Ventas Activas
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(client)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        Editar
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(client.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                        >
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

