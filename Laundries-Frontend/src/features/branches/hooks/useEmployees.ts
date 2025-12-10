import { useEffect, useState } from "react";
import { getEmployees, updateEmployee, createManager } from "../services/employees.service";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getEmployees();
    setEmployees(data);
    setLoading(false);
  }

  async function edit(id: string, payload: any) {
    await updateEmployee(id, payload);
    await load();
  }

  async function create(payload: any) {
    await createManager(payload);
    await load();
  }

  useEffect(() => { load(); }, []);

  return { employees, loading, edit, create, reload: load };
}