import React from "react";

const AdminReports: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes de Administrador</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Reportes Generales</h2>
        <p className="text-gray-700">
          Aquí se mostrarán los reportes de todas las sucursales.
        </p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Reportes por Sucursal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-semibold">Sucursal 1</h3>
            <p className="text-gray-600">Detalles del reporte...</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-semibold">Sucursal 2</h3>
            <p className="text-gray-600">Detalles del reporte...</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-semibold">Sucursal 3</h3>
            <p className="text-gray-600">Detalles del reporte...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
