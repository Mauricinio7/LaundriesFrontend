import React from "react";

const BranchesPage: React.FC = () => {
  const branches = [
    {
      id: 1,
      name: "Sucursal Centro",
      address: "Calle Principal 123, Centro",
      city: "Santiago",
    },
    {
      id: 2,
      name: "Sucursal Norte",
      address: "Avenida del Norte 456, Barrio Norte",
      city: "Santiago",
    },
    {
      id: 3,
      name: "Sucursal Sur",
      address: "Pasaje Sur 789, Zona Sur",
      city: "Santiago",
    },
    {
      id: 4,
      name: "Sucursal Oriente",
      address: "Calle Este 321, Sector Oriente",
      city: "Santiago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Nuestras Sucursales
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {branch.name}
              </h2>
              <div className="flex items-start gap-2 text-gray-600">
                <svg
                  className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.5 13a3 3 0 11-6 0 3 3 0 016 0zm12.066-7.07a3.75 3.75 0 00-5.304-5.304 3.75 3.75 0 10 5.304 5.304zm2.25 1.184a5.25 5.25 0 11-7.425-7.425 5.25 5.25 0 017.425 7.425z" />
                </svg>
                <p>{branch.address}</p>
              </div>
              <p className="text-sm text-gray-500 mt-3">{branch.city}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchesPage;
