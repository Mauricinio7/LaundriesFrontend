import React, { useState, useEffect } from "react";

interface Order {
  id: string;
  customerName: string;
  serviceType: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
  total: number;
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: Implementar cuando esté disponible el endpoint
  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
    }
  };

  if (loading) return <div className="p-8">Cargando órdenes...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Órdenes de Lavandería</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Cliente</th>
              <th className="border p-3 text-left">Servicio</th>
              <th className="border p-3 text-left">Estado</th>
              <th className="border p-3 text-left">Fecha</th>
              <th className="border p-3 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border p-3">{order.id}</td>
                <td className="border p-3">{order.customerName}</td>
                <td className="border p-3">{order.serviceType}</td>
                <td className="border p-3">
                  <span
                    className={`px-3 py-1 rounded ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border p-3">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="border p-3">${order.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
