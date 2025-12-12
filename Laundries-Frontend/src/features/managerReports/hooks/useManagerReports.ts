import { useState } from "react";
import { getManagerAnnualSales } from "../services/managerReports.service";

export function useManagerReports() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadReport(idSucursal: string, anio: number) {
    try {
      setLoading(true);
      const data = await getManagerAnnualSales(idSucursal, anio);
      setReport(data);
    } catch (err) {
      console.error(err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  return { report, loading, loadReport };
}