import { useEffect, useState } from "react";
import { useManagerReports } from "../features/managerReports/hooks/useManagerReports";

import { YearSelector } from "../features/adminReports/components/YearSelector";
import { SalesChart } from "../features/adminReports/components/SalesChart";
import { TopEmployeesChart } from "../features/adminReports/components/TopEmployeesChart";

import {
  exportReportToPDF,
  exportReportToExcel,
} from "../features/adminReports/utils/exportReports";

export default function ManagerReportsPage() {
  const raw = localStorage.getItem("laundries:auth");
  const profile = raw ? JSON.parse(raw).profile : null;

  const idSucursal = profile?.idSucursal;

  const [year, setYear] = useState(new Date().getFullYear());
  const { report, loading, loadReport } = useManagerReports();

  // cargar reporte inicial
  useEffect(() => {
    if (idSucursal) loadReport(idSucursal, year);
  }, []);

  function handleYearChange(anio: number) {
    setYear(anio);
    if (idSucursal) loadReport(idSucursal, anio);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reportes de Sucursal</h1>

      <p className="text-gray-700 text-lg">
        Sucursal: <strong>{profile?.nombreSucursal ?? idSucursal}</strong>
      </p>

      {/* SELECTOR DE AÑO */}
      <div className="flex items-center gap-4">
        <p className="text-lg">Seleccionar año:</p>
        <YearSelector value={year} onChange={handleYearChange} />
      </div>

      {/* BOTONES DE DESCARGA */}
      {report && (
        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
            onClick={() => exportReportToPDF(report)}
          >
            Descargar PDF
          </button>

          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            onClick={() => exportReportToExcel(report)}
          >
            Descargar Excel
          </button>
        </div>
      )}

      {loading && <p className="text-gray-600">Cargando reportes...</p>}

      {report && (
        <div className="space-y-8">
          {/* GRÁFICA DE VENTAS */}
          <SalesChart ventasTotales={report.ventas_totales} />

          {/* TOP EMPLEADOS */}
          <TopEmployeesChart empleados={report.top_empleados} />

          {/* DETALLE */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-3">Detalle de la Sucursal</h3>

            {report.detalle_por_sucursal.length === 0 ? (
              <p className="text-gray-600">Sin datos disponibles.</p>
            ) : (
              report.detalle_por_sucursal.map((s: any) => {
                const meses = Object.keys(s.ventas);
                const total = meses.reduce(
                  (acc, mes) => acc + s.ventas[mes],
                  0
                );

                return (
                  <div key={s.sucursal_id} className="border rounded-lg p-3 mb-3">
                    <p className="font-bold text-lg">{s.sucursal}</p>

                    {meses.length === 0 ? (
                      <p className="text-gray-600">No hubo ventas este año.</p>
                    ) : (
                      <>
                        <p>
                          Total anual:{" "}
                          <strong>${total.toFixed(2)}</strong>
                        </p>
                        <p>Meses: {meses.join(", ")}</p>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}