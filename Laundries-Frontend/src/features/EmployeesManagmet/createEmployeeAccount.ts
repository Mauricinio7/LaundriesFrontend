import type { CreateEmployeeAccountPayload } from "./types";

const AUTH_API = "http://100.68.70.25:5500";

export async function createEmployeeAccount(
  payload: CreateEmployeeAccountPayload,
  token: string
): Promise<{ id: string }> {
  const res = await fetch(`${AUTH_API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("ERROR_CREATING_ACCOUNT");
  }

  const json = await res.json();

  return { id: json.data.id };
}