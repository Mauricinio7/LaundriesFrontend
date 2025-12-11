import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  empleados: Array<{
    empleado: string;
    ventas: number;
  }>;
}

export function TopEmployeesChart({ empleados }: Props) {
  if (!empleados || empleados.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-3">Top Empleados</h3>
        <p className="text-gray-600">No hay datos de empleados este año.</p>
      </div>
    );
  }

  const labels = empleados.map((e) => e.empleado);
  const dataVentas = empleados.map((e) => e.ventas);

  const data = {
    labels,
    datasets: [
      {
        label: "Ventas",
        data: dataVentas,
        backgroundColor: "#10B981", 
        borderColor: "#059669",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-3">Top Empleados</h3>
      <Bar data={data} />
    </div>
  );
}