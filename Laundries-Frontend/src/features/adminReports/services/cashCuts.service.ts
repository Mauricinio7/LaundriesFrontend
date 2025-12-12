const BASE_URL = "http://localhost:8886/corte-caja";

function authHeaders() {
  const raw = localStorage.getItem("laundries:auth");
  const data = raw ? JSON.parse(raw) : null;
  const token = data?.accessToken;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function getCashCutsByYear(year: number) {
  const res = await fetch(`${BASE_URL}/${year}/por-mes`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("No se pudieron obtener los cortes de caja");
  }

  return res.json();
}