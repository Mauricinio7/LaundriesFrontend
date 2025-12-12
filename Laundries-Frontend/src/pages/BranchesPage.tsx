import { useState } from "react";
import { useBranches } from "../features/branches/hooks/useBranches";
import { useEmployeesBySucursal } from "../features/branches/hooks/useEmployeesBySucursal";

import { BranchCard } from "../features/branches/components/BranchCard";
import { EditBranchModal } from "../features/branches/components/EditBranchModal";
import { AddManagerModal } from "../features/branches/components/AddManagerModal";
import { EditEmployeeModal } from "../features/branches/components/EditEmployeeModal";
import { EmployeesBySucursalModal } from "../features/branches/components/EmployeesBySucursalModal";
import { AddBranchModal } from "../features/branches/components/AddBranchModal";

export default function BranchesPage() {
  const {
    branches,
    loading,
    editBranch,
    cancelBranch,
    addBranch,        
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
        onCreate={async (payload: { nombre: string; direccion: string; telefono: string }) => {
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
        onCreate={() => {}}
      />

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

      <EditEmployeeModal
        open={openEditEmployee}
        employee={selectedEmployee}
        onClose={() => setOpenEditEmployee(false)}
        onSave={editEmployee}
      />
    </div>
  );
}