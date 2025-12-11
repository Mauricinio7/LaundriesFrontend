const BASE_URL = "http://100.68.70.25:8881/sucursales";

export interface Branch {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: boolean;
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
 * Obtiene todas las sucursales
 */
export async function getBranches(): Promise<Branch[]> {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error al obtener sucursales: ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * Obtiene una sucursal por ID
 */
export async function getBranchById(id: string): Promise<Branch> {
  const branches = await getBranches();
  const branch = branches.find((b) => String(b.id) === String(id));
  
  if (!branch) {
    throw new Error(`Sucursal con ID ${id} no encontrada`);
  }
  
  return branch;
}

