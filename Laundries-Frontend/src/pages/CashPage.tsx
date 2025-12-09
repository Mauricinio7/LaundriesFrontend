import React, { useState } from "react";

export default function CashPage() {
  const [cashRegister, setCashRegister] = useState({
    openingBalance: 0,
    sales: 0,
    expenses: 0,
    closingBalance: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const [cutHistory, setCutHistory] = useState([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCashRegister({
      ...cashRegister,
      [name]: parseFloat(value) || 0,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCashRegister({
      ...cashRegister,
      date: e.target.value,
    });
  };

  const handleCashCut = () => {
    const newCut = {
      id: Date.now(),
      ...cashRegister,
      total:
        cashRegister.openingBalance +
        cashRegister.sales -
        cashRegister.expenses,
    };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Corte de Caja</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fecha</label>
            <input
              type="date"
              name="date"
              value={cashRegister.date}
              onChange={handleDateChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Saldo Inicial
            </label>
            <input
              type="number"
              name="openingBalance"
              value={cashRegister.openingBalance}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Ventas</label>
            <input
              type="number"
              name="sales"
              value={cashRegister.sales}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gastos</label>
            <input
              type="number"
              name="expenses"
              value={cashRegister.expenses}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded mb-4">
          <p className="text-lg font-semibold">
            Total: $
            {(
              cashRegister.openingBalance +
              cashRegister.sales -
              cashRegister.expenses
            ).toFixed(2)}
          </p>
        </div>

        <button
          onClick={handleCashCut}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700"
        >
          Realizar Corte
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Historial de Cortes</h2>
        {cutHistory.length === 0 ? (
          <p className="text-gray-500">No hay cortes realizados</p>
        ) : (
          <div className="space-y-4">
            {cutHistory.map((cut: any) => (
              <div key={cut.id} className="bg-white rounded-lg shadow p-4">
                <p className="font-semibold">{cut.date}</p>
                <p className="text-sm">
                  Inicial: ${cut.openingBalance.toFixed(2)}
                </p>
                <p className="text-sm">Ventas: ${cut.sales.toFixed(2)}</p>
                <p className="text-sm">Gastos: ${cut.expenses.toFixed(2)}</p>
                <p className="text-lg font-bold">
                  Total: ${cut.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
