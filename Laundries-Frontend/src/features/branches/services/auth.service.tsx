const AUTH_URL = "http://100.68.70.25:5500/auth/register";

function authHeaders() {
  const raw = localStorage.getItem("laundries:auth");
  const data = raw ? JSON.parse(raw) : null;
  const token = data?.accessToken;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface RegisterManagerPayload {
  email: string;
  password: string;
}

export async function registerManager(payload: RegisterManagerPayload) {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      ...payload,
      role: "MANAGER",
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("Error registrando manager:", json);
    throw new Error("No se pudo crear el usuario manager");
  }

  return json;
}