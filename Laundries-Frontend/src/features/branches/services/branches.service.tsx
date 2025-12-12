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

export async function createBranch(data: any) {
  const raw = localStorage.getItem("laundries:auth");
  const token = raw ? JSON.parse(raw)?.accessToken : null;

  const res = await fetch("http://100.68.70.25:8881/sucursales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error creando sucursal");

  return res.json();
}