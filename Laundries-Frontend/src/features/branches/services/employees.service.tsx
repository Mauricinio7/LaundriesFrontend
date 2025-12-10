const BASE_URL = "http://100.68.70.25:8882/employees";
const BASE_MANAGERS = `${BASE_URL}/gerentes`;

function authHeaders() {
  const raw = localStorage.getItem("laundries:auth");
  const data = raw ? JSON.parse(raw) : null;
  const token = data?.accessToken;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET employees
export async function getEmployees() {
  const res = await fetch(BASE_URL, { headers: authHeaders() });
  if (!res.ok) throw new Error("No autorizado para obtener empleados");
  return res.json();
}

// POST employees/gerentes
export async function createManager(data: any) {
  const res = await fetch(BASE_MANAGERS, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("No autorizado para crear gerente");
  return res.json();
}

// PUT employees/gerentes/:id
export async function updateEmployee(id: string, data: any) {
  const res = await fetch(`${BASE_MANAGERS}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("No autorizado para actualizar empleado");
  return res.json();
}

// GET employees by sucursal
export async function getEmployeesBySucursal(idSucursal: string) {
    const url = `${BASE_URL}/by-sucursal/${idSucursal}`;
  
    const res = await fetch(url, {
      method: "GET",
      headers: authHeaders(),
    });
  
    if (!res.ok) {
      console.error("ERROR EMPLEADOS SUCURSAL:", await res.text());
      throw new Error("No autorizado para obtener empleados por sucursal");
    }
  
    return res.json();
  }