import { useState, useEffect } from "react";
import { getActiveSales, type Sale } from "../../../shared/lib/order.service";

export const useActiveSales = (idSucursal: string | number | null, idCliente?: string | number) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSales = async () => {
    if (!idSucursal) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getActiveSales(idSucursal, idCliente);
      setSales(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las ventas activas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [idSucursal, idCliente]);

  return {
    sales,
    loading,
    error,
    loadSales,
  };
};

