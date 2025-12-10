import { useState } from "react";

export function EditBranchModal({ open, branch, onClose, onSave, onCancel }: any) {
  if (!open || !branch) return null;

  const [form, setForm] = useState({
    nombre: branch.nombre,
    direccion: branch.direccion,
    telefono: branch.telefono,
  });

  async function handleSave() {
    await onSave(branch.id, { ...form, estado: true });
    onClose();
  }

  async function handleDeactivate() {
    await onCancel(branch.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Editar Sucursal</h2>

        {Object.keys(form).map((f) => (
          <input
            key={f}
            value={(form as any)[f]}
            placeholder={f}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            className="w-full border p-2 rounded"
          />
        ))}

        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>

          <button
            onClick={handleDeactivate}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Cancelar Sucursal
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-center text-gray-600 underline"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}