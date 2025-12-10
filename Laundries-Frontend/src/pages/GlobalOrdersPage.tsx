import React, { useState } from "react";
import { useAuth } from "../features/Login/AuthProvider";
import { SearchBar } from "../shared/ui/SearchBar";
import { useActiveSales } from "../features/orders/hooks/useActiveSales";
import { ActiveSalesList } from "../features/orders/components/ActiveSalesList";
import { ErrorAlert } from "../features/services/components/ErrorAlert";
import type { Client } from "../shared/lib/client.service";

export default function GlobalOrdersPage() {
  const { profile } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const idSucursal = profile?.idSucursal || null;
  const { sales, loading, error } = useActiveSales(
    idSucursal,
    selectedClient?.id
  );

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleClearClient = () => {
    setSelectedClient(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ventas Activas
          </h1>
          <p className="text-gray-600">
            Busca un cliente para ver sus ventas activas o visualiza todas las
            ventas de la sucursal
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Cliente
            </label>
            <SearchBar
              onSelectClient={handleSelectClient}
              onClear={handleClearClient}
              placeholder="Buscar por nombre, teléfono o correo..."
            />
            {selectedClient && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Cliente seleccionado: {selectedClient.nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedClient.correo} • {selectedClient.telefono}
                    </p>
                  </div>
                  <button
                    onClick={handleClearClient}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Limpiar filtro
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <ErrorAlert message={error || ""} />

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedClient
                ? `Ventas Activas de ${selectedClient.nombre}`
                : "Todas las Ventas Activas"}
            </h2>
            {sales.length > 0 && (
              <span className="text-sm text-gray-600">
                {sales.length} venta(s) activa(s)
              </span>
            )}
          </div>
          <ActiveSalesList sales={sales} loading={loading} />
        </div>
      </div>
    </div>
  );
}
