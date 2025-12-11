const BASE_URL = "http://100.68.70.25:8882/employees";

export interface Employee {
  id: string;
  nombre: string;
  email: string;
  idSucursal: string;
  [key: string]: unknown;
}

function authHeaders(): Record<string, string> {
  const raw = localStorage.getItem("laundries:auth");
  const data = raw ? JSON.parse(raw) : null;
  const token = data?.accessToken;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Obtiene todos los empleados de una sucursal
 */
export async function getEmployeesBySucursal(
  idSucursal: string
): Promise<Employee[]> {
  const url = `${BASE_URL}/by-sucursal/${idSucursal}`;
  const res = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error al obtener empleados: ${res.statusText}`
    );
  }

  return res.json();
}

