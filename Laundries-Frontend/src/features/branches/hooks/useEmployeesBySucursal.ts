import { useState } from "react";
import { getEmployeesBySucursal, updateEmployee } from "../services/employees.service";

export function useEmployeesBySucursal() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load(idSucursal: string) {
    setLoading(true);
    const data = await getEmployeesBySucursal(idSucursal);
    setEmployees(data);
    setLoading(false);
  }

  async function edit(id: string, payload: any) {
    await updateEmployee(id, payload);
    if (employees.length > 0) {
      await load(employees[0].idSucursal);
    }
  }

  return { employees, loading, load, edit };
}