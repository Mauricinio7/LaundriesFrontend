import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ReportData {
  anio: number;
  ventas_totales: Record<string, number>;
  top_empleados: Array<{ empleado: string; ventas: number }>;
  detalle_por_sucursal: Array<{
    sucursal: string;
    sucursal_id: string;
    ventas: Record<string, number>;
  }>;
}

export function exportReportToPDF(report: ReportData) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Reporte Anual - ${report.anio}`, 15, 15);

  doc.setFontSize(14);
  doc.text("Ventas Totales:", 15, 30);

  autoTable(doc, {
    startY: 35,
    head: [["Mes", "Total"]],
    body: Object.entries(report.ventas_totales).map(([mes, total]) => [
      mes,
      `$${total.toFixed(2)}`,
    ]),
  });

  let posY = (doc as any).lastAutoTable.finalY + 10;

  doc.text("Top Empleados:", 15, posY);

  autoTable(doc, {
    startY: posY + 5,
    head: [["Empleado", "Ventas"]],
    body: report.top_empleados.map((e) => [e.empleado, e.ventas]),
  });

  posY = (doc as any).lastAutoTable.finalY + 10;

  doc.text("Ventas por Sucursal:", 15, posY);

  autoTable(doc, {
    startY: posY + 5,
    head: [["Sucursal", "Mes", "Ventas"]],
    body: report.detalle_por_sucursal.flatMap((s) =>
      Object.entries(s.ventas).map(([mes, total]) => [
        s.sucursal,
        mes,
        `$${total.toFixed(2)}`,
      ])
    ),
  });

  doc.save(`reporte-${report.anio}.pdf`);
}

export function exportReportToExcel(report: ReportData) {
  const wb = XLSX.utils.book_new();

  const ventasTotalesSheet = XLSX.utils.json_to_sheet(
    Object.entries(report.ventas_totales).map(([mes, total]) => ({
      Mes: mes,
      Total: total,
    }))
  );
  XLSX.utils.book_append_sheet(wb, ventasTotalesSheet, "Ventas Totales");

  const topSheet = XLSX.utils.json_to_sheet(
    report.top_empleados.map((emp) => ({
      Empleado: emp.empleado,
      Ventas: emp.ventas,
    }))
  );
  XLSX.utils.book_append_sheet(wb, topSheet, "Top Empleados");

  const detalleSheet = XLSX.utils.json_to_sheet(
    report.detalle_por_sucursal.flatMap((s) =>
      Object.entries(s.ventas).map(([mes, total]) => ({
        Sucursal: s.sucursal,
        Mes: mes,
        Ventas: total,
      }))
    )
  );
  XLSX.utils.book_append_sheet(wb, detalleSheet, "Por Sucursal");

  XLSX.writeFile(wb, `reporte-${report.anio}.xlsx`);
}