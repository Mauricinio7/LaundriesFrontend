import React from "react";

const CustomersPage: React.FC = () => {
  const customers = [
    { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "555-0101" },
    {
      id: 2,
      name: "María García",
      email: "maria@example.com",
      phone: "555-0102",
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos@example.com",
      phone: "555-0103",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "555-0104",
    },
  ];

  const CustomerLogo: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="#3B82F6" strokeWidth="2" />
      <path
        d="M20 10V30M10 20H30"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
          <p className="text-gray-600">
            Gestiona los clientes de tu lavandería
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
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
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <CustomerLogo />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {customer.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
