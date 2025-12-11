import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function SalesChart({ ventasTotales }: { ventasTotales: any }) {
  const meses = Object.keys(ventasTotales);
  const valores = Object.values(ventasTotales);

  const data = {
    labels: meses,
    datasets: [
      {
        label: "Ventas por mes",
        data: valores,
        backgroundColor: "#4F46E5",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-3">Ventas por mes</h3>
      <Bar data={data} />
    </div>
  );
}