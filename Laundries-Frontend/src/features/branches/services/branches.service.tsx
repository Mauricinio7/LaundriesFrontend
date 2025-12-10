const BASE_URL = "http://100.68.70.25:8881/sucursales";

function authHeaders() {
    const raw = localStorage.getItem("laundries:auth");
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
  
    if (raw) {
      const data = JSON.parse(raw);
      const token = data?.accessToken;
  
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
  
    return headers;
  }

// GET sucursales
export async function getBranches() {
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    console.error("ERROR SUCURSALES:", await res.text());
    throw new Error("No autorizado para obtener sucursales");
  }

  return res.json();
}

// PUT sucursales/:id
export async function updateBranch(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error("ERROR ACTUALIZAR:", await res.text());
    throw new Error("No autorizado para editar sucursal");
  }

  return res.json();
}

// PUT sucursales/:id → estado=false
export async function deactivateBranch(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ estado: false }),
  });

  if (!res.ok) {
    console.error("ERROR CANCELAR:", await res.text());
    throw new Error("No autorizado para cancelar sucursal");
  }

  return res.json();
}