import { useEffect, useState } from "react";

interface EditEmployeeModalProps {
  open: boolean;
  employee: any;
  branches: any[];
  onClose: () => void;
  onSave: (id: string, payload: any) => void;
}

export function EditEmployeeModal({
  open,
  employee,
  branches,
  onClose,
  onSave,
}: EditEmployeeModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branchId, setBranchId] = useState("");

  useEffect(() => {
    if (employee) {
      setName(employee.nombre ?? "");
      setPhone(employee.telefono ?? "");
      setBranchId(employee.sucursal_id ?? "");
    }
  }, [employee]);

  if (!open || !employee) return null;

  function handleSubmit() {
    onSave(employee.id, {
      nombre: name,
      telefono: phone,
      idSucursal: branchId,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4">
        <h2 className="text-xl font-bold">Editar empleado</h2>

        <div>
          <label className="text-sm font-semibold">Nombre</label>
          <input
            className="w-full border p-2 rounded-md"
            value={name}
            placeholder="Nombre del empleado"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Teléfono</label>
          <input
            className="w-full border p-2 rounded-md"
            value={phone}
            placeholder="Teléfono"
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Sucursal</label>
          <select
            className="w-full border p-2 rounded-md"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          >
            <option value="">Seleccione una sucursal</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}