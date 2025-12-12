import { createEmployeeAccount } from "./createEmployeeAccount";
import { createEmployeeProfile } from "./createEmployeeProfile";
import type {
  CreateEmployeeAccountPayload,
  CreateEmployeeProfilePayload,
} from "./types";

export async function createEmployee(
  account: CreateEmployeeAccountPayload,
  profile: Omit<CreateEmployeeProfilePayload, "idEmpleado">,
  token: string
) {
  const { id } = await createEmployeeAccount(account, token);

  return createEmployeeProfile(
    {
      ...profile,
      idEmpleado: id,
    },
    token
  );
}