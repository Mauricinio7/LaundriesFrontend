import type { Employee } from "./types";

const EMPLOYEES_API =
  "http://100.68.70.25:8882/employees/by-sucursal";

export async function getEmployeesBySucursal(
  sucursalId: string,
  accessToken: string
): Promise<Employee[]> {
  const res = await fetch(`${EMPLOYEES_API}/${sucursalId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("FAILED_TO_FETCH_EMPLOYEES");
  }

  return res.json();
}