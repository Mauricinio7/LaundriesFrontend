const BASE_URL = "http://100.68.70.25:8889/reportes";

function authHeaders() {
  const raw = localStorage.getItem("laundries:auth");
  const data = raw ? JSON.parse(raw) : null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${data?.accessToken}`,
  };
}

export async function getAnnualSales(anio: number) {
  const url = `${BASE_URL}/ventas-anuales?anio=${anio}`;

  const res = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("No se pudieron obtener los reportes");
  }

  return res.json();
}