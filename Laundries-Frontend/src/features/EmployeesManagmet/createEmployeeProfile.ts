import type { CreateEmployeeProfilePayload } from "./types";

const EMP_API = "http://100.68.70.25:8882";

export async function createEmployeeProfile(
  payload: CreateEmployeeProfilePayload,
  token: string
) {
  const res = await fetch(`${EMP_API}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("ERROR_CREATING_EMPLOYEE");
  }

  return res.json();
}