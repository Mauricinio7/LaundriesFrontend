import React from "react";

const AdminReportsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reportes de Administrador
          </h1>
          <p className="text-gray-600">
            Visualiza y analiza los reportes generales de la lavandería
          </p>
        </div>

        {/* Reportes Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Órdenes
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">
              <span className="font-medium">+12.5%</span> vs mes anterior
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ingresos Totales
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  $45,678
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">
              <span className="font-medium">+8.3%</span> vs mes anterior
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Clientes Activos
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">567</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">
              <span className="font-medium">+5.2%</span> vs mes anterior
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Servicios Activos
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">23</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <span className="font-medium">Sin cambios</span> este mes
            </p>
          </div>
        </div>

        {/* Reportes por Sucursal */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Reportes por Sucursal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sucursal Centro
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Activa
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Órdenes</span>
                  <span className="text-sm font-medium text-gray-900">456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ingresos</span>
                  <span className="text-sm font-medium text-gray-900">
                    $18,234
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Clientes</span>
                  <span className="text-sm font-medium text-gray-900">234</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sucursal Norte
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Activa
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Órdenes</span>
                  <span className="text-sm font-medium text-gray-900">389</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ingresos</span>
                  <span className="text-sm font-medium text-gray-900">
                    $15,678
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Clientes</span>
                  <span className="text-sm font-medium text-gray-900">198</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sucursal Sur
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Activa
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Órdenes</span>
                  <span className="text-sm font-medium text-gray-900">389</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ingresos</span>
                  <span className="text-sm font-medium text-gray-900">
                    $11,766
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Clientes</span>
                  <span className="text-sm font-medium text-gray-900">135</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de ejemplo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tendencia de Ingresos (Últimos 6 meses)
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 72, 68, 80, 75, 85].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-blue-500 rounded-t-lg flex items-end"
                style={{ height: `${height}%` }}
              >
                <div className="w-full bg-blue-600 rounded-t-lg h-full"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Ene</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Abr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
