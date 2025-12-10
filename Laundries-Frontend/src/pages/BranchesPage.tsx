import { useState } from "react";
import { useBranches } from "../features/branches/hooks/useBranches";
import { useEmployeesBySucursal } from "../features/branches/hooks/useEmployeesBySucursal";

import { BranchCard } from "../features/branches/components/BranchCard";
import { EditBranchModal } from "../features/branches/components/EditBranchModal";
import { AddManagerModal } from "../features/branches/components/AddManagerModal";
import { EditEmployeeModal } from "../features/branches/components/EditEmployeeModal";
import { EmployeesBySucursalModal } from "../features/branches/components/EmployeesBySucursalModal";

export default function BranchesPage() {
  const { branches, loading, editBranch, cancelBranch } = useBranches();
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

  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Sucursales</h1>

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

      {/* MODALES */}

      {/* Editar Sucursal */}
      <EditBranchModal
        open={openEditBranch}
        branch={selectedBranch}
        onClose={() => setOpenEditBranch(false)}
        onSave={editBranch}
        onCancel={cancelBranch}
      />

      {/* Agregar Gerente */}
      <AddManagerModal
        open={openAddManager}
        branch={selectedBranch}
        onClose={() => setOpenAddManager(false)}
        onCreate={() => {}}
      />

      {/* Ver empleados por sucursal */}
      <EmployeesBySucursalModal
        open={openEmployeesModal}
        branch={selectedBranch}
        employees={employees}
        loading={loadingEmployees}
        onClose={() => setOpenEmployeesModal(false)}
        onEditEmployee={(emp: any) => {
          setSelectedEmployee(emp);
          setOpenEditEmployee(true);
        }}
      />

      {/* Editar Empleado */}
      <EditEmployeeModal
        open={openEditEmployee}
        employee={selectedEmployee}
        onClose={() => setOpenEditEmployee(false)}
        onSave={editEmployee}
      />
    </div>
  );
}