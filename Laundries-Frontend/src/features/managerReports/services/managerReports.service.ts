const BASE_URL = "http://100.68.70.25:8889/reportes";

function authHeaders() {
  const raw = localStorage.getItem("laundries:auth");
  const data = raw ? JSON.parse(raw) : null;
  const token = data?.accessToken;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getManagerAnnualSales(idSucursal: string, anio: number) {
  const url = `${BASE_URL}/ventas-anuales/sucursal/${idSucursal}?anio=${anio}`;

  const res = await fetch(url, { headers: authHeaders() });

  if (!res.ok) throw new Error("No autorizado o error obteniendo reportes");

  return res.json();
}