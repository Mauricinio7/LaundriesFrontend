import { useState } from "react";
import { getAnnualSales } from "../services/reports.service";

export function useReports() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadReport(anio: number) {
    setLoading(true);
    const data = await getAnnualSales(anio);
    setReport(data);
    setLoading(false);
  }

  return { report, loading, loadReport };
}