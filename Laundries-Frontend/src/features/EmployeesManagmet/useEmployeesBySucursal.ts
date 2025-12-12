import { useEffect, useState } from "react";
import type { Employee } from "./types";
import { getEmployeesBySucursal } from "./employeesApi";
import { useAuth } from "../Login/AuthProvider";

export function useEmployeesBySucursal(idSucursal: string) {
  const { accessToken } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || !idSucursal) return;

    setLoading(true);
    setError(null);

    getEmployeesBySucursal(idSucursal, accessToken)
      .then(setEmployees)
      .catch(() =>
        setError("No se pudieron cargar los empleados.")
      )
      .finally(() => setLoading(false));
  }, [idSucursal, accessToken]);

  return { employees, loading, error };
}