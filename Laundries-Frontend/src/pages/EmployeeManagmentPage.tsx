import { useEffect, useMemo, useState, type FormEvent } from "react";

type StoredAuth = {
  accessToken?: string;
  profile?: { idSucursal?: string };
};

type AuthRoleResponse = {
  success: boolean;
  data?: {
    id: string;
    role: "EMPLOYEE" | "MANAGER" | "ADMIN" | "DELETED" | string;
  };
};

type CreateAccountPayload = {
  email: string;
  password: string;
  role: "EMPLOYEE";
};

type CreateEmployeePayload = {
  idEmpleado: string;
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string; // YYYY-MM-DD
  idSucursal: string;
};

type UpdateEmployeePayload = {
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string; // YYYY-MM-DD
  idSucursal: string; // se manda igual (NO editable)
};

type Employee = {
  id: string; // employees service id
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string; // ISO o YYYY-MM-DD
  idSucursal: string;
};

const AUTH_API = "http://100.68.70.25:5500";
const EMP_API = "http://100.68.70.25:8882";

function readAuthFromStorage(): { token: string; idSucursal: string } {
  try {
    const raw = localStorage.getItem("laundries:auth");
    if (!raw) return { token: "", idSucursal: "-1" };
    const parsed = JSON.parse(raw) as StoredAuth;
    return {
      token: parsed.accessToken ?? "",
      idSucursal: parsed.profile?.idSucursal ?? "-1",
    };
  } catch {
    return { token: "", idSucursal: "-1" };
  }
}

async function fetchEmployeesBySucursal(
  idSucursal: string,
  token: string
): Promise<Employee[]> {
  const res = await fetch(`${EMP_API}/employees/by-sucursal/${idSucursal}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("ERROR_FETCHING_EMPLOYEES");
  const json = await res.json();
  return Array.isArray(json) ? (json as Employee[]) : [];
}

async function fetchUserRoleById(userId: string, token: string): Promise<string> {
  const res = await fetch(`${AUTH_API}/auth/${userId}/role`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("ERROR_FETCHING_ROLE");
  const json = (await res.json()) as AuthRoleResponse;
  const role = json?.data?.role;
  if (!role) throw new Error("ERROR_FETCHING_ROLE");
  return role;
}

async function createEmployeeAccount(
  payload: CreateAccountPayload,
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

  if (!res.ok) throw new Error("ERROR_CREATING_ACCOUNT");

  const json = await res.json();
  const id = json?.data?.id as string | undefined;
  if (!id) throw new Error("ERROR_CREATING_ACCOUNT");
  return { id };
}

async function createEmployeeProfile(payload: CreateEmployeePayload, token: string) {
  const res = await fetch(`${EMP_API}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("ERROR_CREATING_EMPLOYEE");
  return res.json();
}

async function updateEmployee(
  employeeId: string,
  payload: UpdateEmployeePayload,
  token: string
) {
  const res = await fetch(`${EMP_API}/employees/${employeeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("ERROR_UPDATING_EMPLOYEE");
  return res.json();
}

async function softDeleteAccount(userId: string, token: string) {
  const res = await fetch(`${AUTH_API}/auth/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role: "DELETED" }),
  });

  if (!res.ok) throw new Error("ERROR_DELETING_ACCOUNT");
  return res.json();
}

function toDateInputValue(value: string): string {
  if (!value) return "1990-01-01";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "1990-01-01";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function EmployeeManagementPage() {
  const { token, idSucursal } = useMemo(readAuthFromStorage, []);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rolesById, setRolesById] = useState<Record<string, string>>({});
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesWarning, setRolesWarning] = useState<string | null>(null);

  const reloadEmployees = async () => {
    if (!token) {
      setError("No hay token. Inicia sesión de nuevo.");
      return;
    }
    if (idSucursal === "-1") {
      setError("No se encontró la sucursal del usuario.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const list = await fetchEmployeesBySucursal(idSucursal, token);
      setEmployees(list);
    } catch {
      setError("No se pudieron cargar los empleados.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    reloadEmployees();
  }, [token, idSucursal]);

  useEffect(() => {
    let cancelled = false;

    async function loadRoles() {
      if (!token) return;
      if (!employees.length) return;

      const idsToFetch = employees.map((e) => e.id).filter((id) => !rolesById[id]);
      if (!idsToFetch.length) return;

      setRolesLoading(true);
      setRolesWarning(null);

      const results = await Promise.allSettled(
        idsToFetch.map(async (id) => {
          const role = await fetchUserRoleById(id, token);
          return { id, role };
        })
      );

      if (cancelled) return;

      let hadErrors = false;
      setRolesById((prev) => {
        const next = { ...prev };
        for (const r of results) {
          if (r.status === "fulfilled") next[r.value.id] = r.value.role;
          else hadErrors = true;
        }
        return next;
      });

      if (hadErrors) {
        setRolesWarning("Algunos roles no se pudieron cargar. Se muestran los demás.");
      }
      setRolesLoading(false);
    }

    loadRoles();
    return () => {
      cancelled = true;
    };
  }, [employees, token]);
  const getRole = (emp: Employee) => {
    const role = rolesById[emp.id];
    if (role === "DELETED") return "Eliminado";
    return role ?? (rolesLoading ? "Cargando..." : "—");
  };

  const canEditDelete = (role: string) => role === "EMPLOYEE";

  const [openCreate, setOpenCreate] = useState(false);
  const [isSavingCreate, setIsSavingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [cNombre, setCNombre] = useState("");
  const [cDireccion, setCDireccion] = useState("");
  const [cTelefono, setCTelefono] = useState("");
  const [cDni, setCDni] = useState("");
  const [cFechaNacimiento, setCFechaNacimiento] = useState("1990-01-01");
  const [cEmail, setCEmail] = useState("");
  const [cPassword, setCPassword] = useState("");

  const closeCreate = () => {
    setOpenCreate(false);
    setCreateError(null);
    setCNombre("");
    setCDireccion("");
    setCTelefono("");
    setCDni("");
    setCFechaNacimiento("1990-01-01");
    setCEmail("");
    setCPassword("");
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingCreate(true);
    setCreateError(null);

    if (!token) {
      setCreateError("No hay token. Inicia sesión de nuevo.");
      setIsSavingCreate(false);
      return;
    }
    if (idSucursal === "-1") {
      setCreateError("No se encontró la sucursal del usuario.");
      setIsSavingCreate(false);
      return;
    }
    if (
      !cNombre.trim() ||
      !cDireccion.trim() ||
      !cTelefono.trim() ||
      !cDni.trim() ||
      !cEmail.trim() ||
      !cPassword.trim()
    ) {
      setCreateError("Completa todos los campos.");
      setIsSavingCreate(false);
      return;
    }

    try {
      const { id } = await createEmployeeAccount(
        { email: cEmail.trim(), password: cPassword.trim(), role: "EMPLOYEE" },
        token
      );
      await createEmployeeProfile(
        {
          idEmpleado: id,
          nombre: cNombre.trim(),
          direccion: cDireccion.trim(),
          telefono: cTelefono.trim(),
          dni: cDni.trim(),
          fechaNacimiento: cFechaNacimiento,
          idSucursal,
        },
        token
      );

      closeCreate();

      await reloadEmployees();
      setRolesById((prev) => ({ ...prev, [id]: prev[id] ?? "EMPLOYEE" }));
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === "ERROR_CREATING_ACCOUNT") setCreateError("No se pudo crear la cuenta (auth).");
      else if (msg === "ERROR_CREATING_EMPLOYEE")
        setCreateError("Se creó la cuenta, pero falló registrar el empleado (employees).");
      else setCreateError("Ocurrió un error inesperado al crear el empleado.");
    } finally {
      setIsSavingCreate(false);
    }
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Employee | null>(null);

  const [eNombre, setENombre] = useState("");
  const [eDireccion, setEDireccion] = useState("");
  const [eTelefono, setETelefono] = useState("");
  const [eDni, setEDni] = useState("");
  const [eFechaNacimiento, setEFechaNacimiento] = useState("1990-01-01");

  const openEditModal = (emp: Employee) => {
    setEditing(emp);
    setENombre(emp.nombre ?? "");
    setEDireccion(emp.direccion ?? "");
    setETelefono(emp.telefono ?? "");
    setEDni(emp.dni ?? "");
    setEFechaNacimiento(toDateInputValue(emp.fechaNacimiento));
    setEditError(null);
    setOpenEdit(true);
  };

  const closeEdit = () => {
    setOpenEdit(false);
    setEditing(null);
    setEditError(null);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);
    setEditError(null);

    if (!token) {
      setEditError("No hay token. Inicia sesión de nuevo.");
      setIsSavingEdit(false);
      return;
    }
    if (!editing) {
      setEditError("No hay empleado seleccionado.");
      setIsSavingEdit(false);
      return;
    }
    if (!editing.idSucursal) {
      setEditError("No se encontró la sucursal del empleado.");
      setIsSavingEdit(false);
      return;
    }
    if (!eNombre.trim() || !eDireccion.trim() || !eTelefono.trim() || !eDni.trim()) {
      setEditError("Completa todos los campos.");
      setIsSavingEdit(false);
      return;
    }

    try {
      await updateEmployee(
        editing.id,
        {
          nombre: eNombre.trim(),
          direccion: eDireccion.trim(),
          telefono: eTelefono.trim(),
          dni: eDni.trim(),
          fechaNacimiento: eFechaNacimiento,
          idSucursal: editing.idSucursal,
        },
        token
      );

      closeEdit();
      await reloadEmployees();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === "ERROR_UPDATING_EMPLOYEE") setEditError("No se pudo actualizar el empleado.");
      else setEditError("Ocurrió un error inesperado al actualizar.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openDeleteModal = (emp: Employee) => {
    setDeleting(emp);
    setDeleteError(null);
    setOpenDelete(true);
  };

  const closeDelete = () => {
    setOpenDelete(false);
    setDeleting(null);
    setDeleteError(null);
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    if (!token) {
      setDeleteError("No hay token. Inicia sesión de nuevo.");
      setIsDeleting(false);
      return;
    }
    if (!deleting) {
      setDeleteError("No hay empleado seleccionado.");
      setIsDeleting(false);
      return;
    }

    try {
      await softDeleteAccount(deleting.id, token);

      setRolesById((prev) => ({ ...prev, [deleting.id]: "DELETED" }));

      closeDelete();
      await reloadEmployees();
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === "ERROR_DELETING_ACCOUNT") setDeleteError("No se pudo desactivar la cuenta (DELETED).");
      else setDeleteError("Ocurrió un error inesperado al eliminar.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administración de Empleados</h1>

          <button
            onClick={() => setOpenCreate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            + Agregar Empleado
          </button>
        </div>

        {rolesWarning && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            {rolesWarning}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center">
                    Cargando empleados…
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                employees.map((emp) => {
                  const role = getRole(emp);
                  const allowed = canEditDelete(role);

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{emp.nombre}</td>
                      <td className="px-6 py-4">{emp.telefono}</td>

                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                            role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : role === "MANAGER"
                              ? "bg-amber-100 text-amber-800"
                              : role === "EMPLOYEE"
                              ? "bg-green-100 text-green-800"
                              : role === "Eliminado"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-700",
                          ].join(" ")}
                        >
                          {role}
                        </span>
                      </td>

                      <td className="px-6 py-4 space-x-3">
                        <button
                          className={[
                            "font-semibold",
                            allowed ? "text-blue-600 hover:text-blue-800" : "text-slate-300 cursor-not-allowed",
                          ].join(" ")}
                          disabled={!allowed}
                          onClick={() => allowed && openEditModal(emp)}
                          title={allowed ? "Editar" : "No permitido para MANAGER/ADMIN"}
                        >
                          Editar
                        </button>

                        <button
                          className={[
                            "font-semibold",
                            allowed ? "text-red-600 hover:text-red-800" : "text-slate-300 cursor-not-allowed",
                          ].join(" ")}
                          disabled={!allowed}
                          onClick={() => allowed && openDeleteModal(emp)}
                          title={allowed ? "Eliminar (rol DELETED)" : "No permitido para MANAGER/ADMIN"}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {!loading && !error && employees.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No hay empleados registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {rolesLoading && !loading && employees.length > 0 && (
            <div className="px-6 py-3 text-xs text-slate-400">Cargando roles…</div>
          )}
        </div>
      </div>
      {openCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Agregar empleado</h2>
              <button onClick={closeCreate} className="text-gray-500 hover:text-gray-700 font-semibold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    value={cNombre}
                    onChange={(e) => setCNombre(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="Juan Perez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    value={cTelefono}
                    onChange={(e) => setCTelefono(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="555-1234"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                  <input
                    value={cDireccion}
                    onChange={(e) => setCDireccion(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="Calle 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">DNI</label>
                  <input
                    value={cDni}
                    onChange={(e) => setCDni(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={cFechaNacimiento}
                    onChange={(e) => setCFechaNacimiento(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email (cuenta)</label>
                  <input
                    type="email"
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="empleado@laundries.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password (cuenta)</label>
                  <input
                    type="password"
                    value={cPassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                    placeholder="123456"
                  />
                </div>
              </div>

              {createError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {createError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreate}
                  className="rounded-xl px-4 py-2 font-semibold text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSavingCreate}
                  className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSavingCreate ? "Guardando..." : "Crear empleado"}
                </button>
              </div>
            </form>

            <p className="mt-3 text-xs text-gray-400">
              Se crea primero la cuenta (auth) y luego el empleado (employees).
            </p>
          </div>
        </div>
      )}

      {openEdit && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Editar empleado</h2>
              <button onClick={closeEdit} className="text-gray-500 hover:text-gray-700 font-semibold">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    value={eNombre}
                    onChange={(e) => setENombre(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    value={eTelefono}
                    onChange={(e) => setETelefono(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                  <input
                    value={eDireccion}
                    onChange={(e) => setEDireccion(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">DNI</label>
                  <input
                    value={eDni}
                    onChange={(e) => setEDni(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={eFechaNacimiento}
                    onChange={(e) => setEFechaNacimiento(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2"
                  />
                </div>
              </div>

              {editError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {editError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl px-4 py-2 font-semibold text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSavingEdit ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>

            <p className="mt-3 text-xs text-gray-400">
              La sucursal no se modifica (se envía la misma idSucursal del empleado).
            </p>
          </div>
        </div>
      )}

      {openDelete && deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">Confirmar eliminación</h2>
              <button onClick={closeDelete} className="text-gray-500 hover:text-gray-700 font-semibold">
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-700">
              ¿Seguro que quieres desactivar la cuenta de{" "}
              <span className="font-semibold">{deleting.nombre}</span>?
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Esto deja el rol como <span className="font-semibold">Eliminado</span>.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {deleteError}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDelete}
                className="rounded-xl px-4 py-2 font-semibold text-gray-600 hover:text-gray-800"
                disabled={isDeleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}