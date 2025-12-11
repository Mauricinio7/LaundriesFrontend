import { useState, useMemo } from "react";
import { useAuth } from "../features/Login/AuthProvider";
import { SearchBar } from "../shared/ui/SearchBar";
import { useActiveSales } from "../features/orders/hooks/useActiveSales";
import { ActiveSalesList } from "../features/orders/components/ActiveSalesList";
import { ErrorAlert } from "../features/services/components/ErrorAlert";
import type { Client } from "../shared/lib/client.service";

export const OrdersPage: React.FC = () => {
  const { profile } = useAuth();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const idSucursal = profile?.idSucursal || null;
  const idEmpleado = profile?.idEmpleado || null;

  // Obtener todas las ventas activas de la sucursal
  const { sales: allSales, loading, error } = useActiveSales(
    idSucursal,
    selectedClient?.id
  );

  // Filtrar solo las ventas que atendió este empleado
  const mySales = useMemo(() => {
    if (!idEmpleado) return [];
    return allSales.filter((sale) => String(sale.id_empleado) === String(idEmpleado));
  }, [allSales, idEmpleado]);

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
            Mis Órdenes Pendientes
          </h1>
          <p className="text-gray-600">
            Visualiza y gestiona las órdenes que has atendido y que aún están pendientes
          </p>
        </div>

        {/* Barra de búsqueda */}
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
                      Filtrando por: {selectedClient.nombre}
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
                ? `Órdenes Pendientes de ${selectedClient.nombre}`
                : "Mis Órdenes Pendientes"}
            </h2>
            {mySales.length > 0 && (
              <span className="text-sm text-gray-600">
                {mySales.length} orden(es) pendiente(s)
              </span>
            )}
          </div>
          <ActiveSalesList 
            sales={mySales} 
            loading={loading} 
            idSucursal={idSucursal}
            hideEmployeeInfo={true}
          />
        </div>

        {!loading && mySales.length === 0 && allSales.length > 0 && (
          <div className="mt-4 text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-2">
              No tienes órdenes pendientes en este momento
            </p>
            <p className="text-sm text-gray-400">
              {selectedClient 
                ? "Este cliente no tiene órdenes pendientes atendidas por ti"
                : "Todas tus órdenes han sido completadas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
