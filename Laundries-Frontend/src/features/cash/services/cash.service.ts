const BASE_URL = "http://100.68.70.25:8886/corte-caja";

function authHeaders() {
  const raw = localStorage.getItem("laundries:auth");
  const data = raw ? JSON.parse(raw) : null;
  const token = data?.accessToken;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export interface CashRequest {
  sucursal_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  dinero_inicial: number;
  monto_reportado_por_empleado: number;
}

export async function makeCashCut(data: CashRequest) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Error generando corte:", err);
    throw new Error("No se pudo generar el corte de caja");
  }

  return res.json();
}