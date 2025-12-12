import { useState } from "react";
import { getEmployeesBySucursal, updateEmployee } from "../services/employees.service";
import type { Employee } from "../../EmployeesManagmet/types";

export function useEmployeesBySucursal() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(idSucursal: string) {
    setLoading(true);
    setError(null);

    try {
      const data = await getEmployeesBySucursal(idSucursal);
      setEmployees(data);
    } catch {
      setError("No se pudieron cargar los empleados.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  async function edit(id: string, payload: Partial<Employee>) {
    setError(null);

    try {
      await updateEmployee(id, payload);

      // recargar la lista usando el idSucursal del primer empleado (si existe)
      const idSucursal = employees[0]?.idSucursal;
      if (idSucursal) {
        await load(idSucursal);
      }
    } catch {
      setError("No se pudo actualizar el empleado.");
      throw new Error("ERROR_UPDATING_EMPLOYEE");
    }
  }

  return { employees, loading, error, load, edit };
}