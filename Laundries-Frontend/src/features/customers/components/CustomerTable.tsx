import React from "react";
import type { Client } from "../../../shared/lib/client.service";
import { CustomerLogo } from "./CustomerLogo";

interface CustomerTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
  isAdmin: boolean;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  clients,
  onEdit,
  onDelete,
  isAdmin,
}) => {
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

