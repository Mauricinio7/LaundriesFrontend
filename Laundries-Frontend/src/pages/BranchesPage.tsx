import { useState } from "react";
import { useBranches } from "../features/branches/hooks/useBranches";
import { useEmployeesBySucursal } from "../features/branches/hooks/useEmployeesBySucursal";

import { BranchCard } from "../features/branches/components/BranchCard";
import { EditBranchModal } from "../features/branches/components/EditBranchModal";
import { AddManagerModal } from "../features/branches/components/AddManagerModal";
import { EditEmployeeModal } from "../features/branches/components/EditEmployeeModal";
import { EmployeesBySucursalModal } from "../features/branches/components/EmployeesBySucursalModal";
import { AddBranchModal } from "../features/branches/components/AddBranchModal";

import { registerManager } from "../features/branches/services/auth.service";
import { createManager } from "../features/branches/services/employees.service";

export interface Employee {
  idEmpleado: string;
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  idSucursal: string;
}

export interface AddBranchPayload {
  nombre: string;
  direccion: string;
  telefono: string;
}

export default function BranchesPage() {
  const {
    branches,
    loading,
    editBranch,
    cancelBranch,
    addBranch,
    reload,
  } = useBranches();

  const {
    employees,
    loading: loadingEmployees,
    load: loadEmployeesBySucursal,
    edit: editEmployee,
  } = useEmployeesBySucursal();

  const [openEditBranch, setOpenEditBranch] = useState(false);
  const [openAddManager, setOpenAddManager] = useState(false);
  const [openEmployeesModal, setOpenEmployeesModal] = useState(false);
  const [openEditEmployee, setOpenEditEmployee] = useState(false);
  const [openAddBranch, setOpenAddBranch] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sucursales</h1>

        <button
          onClick={() => setOpenAddBranch(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          + Agregar Sucursal
        </button>
      </div>

      <div className="space-y-4">
        {branches.map((branch: any) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onEdit={(b) => {
              setSelectedBranch(b);
              setOpenEditBranch(true);
            }}
            onAddManager={(b) => {
              setSelectedBranch(b);
              setOpenAddManager(true);
            }}
            onShowEmployees={(b) => {
              setSelectedBranch(b);
              loadEmployeesBySucursal(b.id);
              setOpenEmployeesModal(true);
            }}
          />
        ))}
      </div>

      <AddBranchModal
        open={openAddBranch}
        onClose={() => setOpenAddBranch(false)}
        onCreate={async (payload: AddBranchPayload) => {
          await addBranch(payload);
          setOpenAddBranch(false);
        }}
      />

      <EditBranchModal
        open={openEditBranch}
        branch={selectedBranch}
        onClose={() => setOpenEditBranch(false)}
        onSave={editBranch}
        onCancel={cancelBranch}
      />

      <AddManagerModal
        open={openAddManager}
        branch={selectedBranch}
        onClose={() => setOpenAddManager(false)}
        onCreate={async (payload) => {
          try {
            const authResp = await registerManager({
              email: payload.email,
              password: payload.password,
            });

            const userId = authResp?.data?.id;

            if (!userId) {
              console.error("Respuesta authResp:", authResp);
              throw new Error("auth-api no devolvió id del usuario");
            }

            await createManager({
              nombre: payload.nombre,
              telefono: payload.telefono,
              direccion: payload.direccion,
              dni: payload.dni,
              fechaNacimiento: payload.fechaNacimiento,
              idEmpleado: userId,
              idSucursal: selectedBranch.id,
            });

            alert("Gerente creado correctamente");

            await reload();

            setOpenAddManager(false);
          } catch (err) {
            console.error(err);
            alert("Error creando el gerente");
          }
        }}
      />

      <EmployeesBySucursalModal
        open={openEmployeesModal}
        branch={selectedBranch}
        employees={employees}
        loading={loadingEmployees}
        onClose={() => setOpenEmployeesModal(false)}
        onEditEmployee={(emp: Employee) => {
          setSelectedEmployee(emp);
          setOpenEditEmployee(true);
        }}
      />

      <EditEmployeeModal
        open={openEditEmployee}
        employee={selectedEmployee}
        branches={branches}
        onClose={() => setOpenEditEmployee(false)}
        onSave={editEmployee}
      />
    </div>
  );
}