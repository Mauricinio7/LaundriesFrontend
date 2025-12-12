import { useState, useEffect } from "react";
import { useReports } from "../features/adminReports/hooks/useReports";

import { YearSelector } from "../features/adminReports/components/YearSelector";
import { SalesChart } from "../features/adminReports/components/SalesChart";
import { TopEmployeesChart } from "../features/adminReports/components/TopEmployeesChart";

import {
  exportReportToPDF,
  exportReportToExcel,
} from "../features/adminReports/utils/exportReports";

import { getCashCutsByYear } from "../features/adminReports/services/cashCuts.service";

interface CorteCaja {
  id: number;
  sucursal_id: string;
  empleado_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  created_at: string;
  total_ventas: string;
  total_devoluciones: string;
  dinero_inicial: string;
  monto_reportado_por_empleado: string;
  diferencia: string;
}

interface MesCortes {
  mes: number;
  cortes: CorteCaja[];
}

export default function AdminReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { report, loading, loadReport } = useReports();

  useEffect(() => {
    loadReport(year);
  }, []);

  function handleYearChange(anio: number) {
    setYear(anio);
    loadReport(anio);
  }

  async function downloadCashCuts() {
    try {
      const data: MesCortes[] = await getCashCutsByYear(year);

      if (!data || data.length === 0) {
        alert("No hay cortes de caja registrados para este año.");
        return;
      }

      const rows: any[] = [];

      data.forEach((m: MesCortes) => {
        const mes = m.mes;

        m.cortes.forEach((corte: CorteCaja) => {
          rows.push({
            mes,
            id_corte: corte.id,
            sucursal_id: corte.sucursal_id,
            empleado_id: corte.empleado_id,
            fecha_inicio: corte.fecha_inicio,
            fecha_fin: corte.fecha_fin,
            total_ventas: corte.total_ventas,
            total_devoluciones: corte.total_devoluciones,
            dinero_inicial: corte.dinero_inicial,
            monto_reportado_por_empleado: corte.monto_reportado_por_empleado,
            diferencia: corte.diferencia,
          });
        });
      });

      const header = Object.keys(rows[0]).join(",") + "\n";
      const body = rows.map((r) => Object.values(r).join(",")).join("\n");

      const csv = header + body;

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `cortes_caja_${year}.csv`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("No se pudieron obtener los cortes de caja");
    }
  }


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reportes de Ventas Anuales</h1>

      <div className="flex items-center gap-4">
        <p className="text-lg">Seleccionar año:</p>
        <YearSelector value={year} onChange={handleYearChange} />
      </div>

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

          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow"
            onClick={downloadCashCuts}
          >
            Descargar cortes de caja
          </button>
        </div>
      )}

      {loading && <p className="text-gray-600">Cargando reportes...</p>}

      {report && (
        <div className="space-y-8">
          <SalesChart ventasTotales={report.ventas_totales} />

          <TopEmployeesChart empleados={report.top_empleados} />

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-3">Detalle por Sucursal</h3>

            <ul className="space-y-3">
              {report.detalle_por_sucursal.map((s: any) => {
                const ventas = s.ventas || {};
                const meses = Object.keys(ventas);
                const totalSucursal = meses.reduce(
                  (acc, mes) => acc + ventas[mes],
                  0
                );

                return (
                  <li
                    key={s.sucursal_id ?? s.sucursal}
                    className="border p-3 rounded-lg"
                  >
                    <p className="font-bold text-lg">{s.sucursal}</p>

                    {meses.length === 0 ? (
                      <p className="text-gray-600 text-sm">
                        Sin ventas registradas este año.
                      </p>
                    ) : (
                      <div className="text-sm text-gray-700">
                        <p>
                          Total anual:{" "}
                          <strong>${totalSucursal.toFixed(2)}</strong>
                        </p>
                        <p>Meses con ventas: {meses.join(", ")}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}