import { useState } from "react";
import { createEmployee } from "./createEmployee";

export function useCreateEmployee() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    account: any,
    profile: any,
    token: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      await createEmployee(account, profile, token);
    } catch (e) {
      if ((e as Error).message === "ERROR_CREATING_ACCOUNT") {
        setError("No se pudo crear la cuenta del empleado.");
      } else if ((e as Error).message === "ERROR_CREATING_EMPLOYEE") {
        setError(
          "La cuenta se creó, pero falló el registro del empleado."
        );
      } else {
        setError("Error inesperado.");
      }
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}