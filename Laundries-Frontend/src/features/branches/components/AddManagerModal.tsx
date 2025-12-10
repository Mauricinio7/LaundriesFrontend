import { useState } from "react";

export function AddManagerModal({ open, branch, onClose, onCreate }: any) {
  if (!open || !branch) return null;

  const [form, setForm] = useState({
    idEmpleado: crypto.randomUUID(),
    nombre: "",
    direccion: "",
    telefono: "",
    dni: "",
    fechaNacimiento: "",
  });

  async function handleCreate() {
    await onCreate({
      ...form,
      idSucursal: branch.id,
      role: "MANAGER",
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Agregar Gerente</h2>

        {Object.keys(form).map((f) => (
          <input
            key={f}
            placeholder={f}
            value={(form as any)[f]}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            className="w-full border p-2 rounded"
          />
        ))}

        <button
          onClick={handleCreate}
          className="w-full px-4 py-2 bg-green-600 text-white rounded"
        >
          Crear Gerente
        </button>

        <button onClick={onClose} className="w-full text-gray-600 underline">
          Cerrar
        </button>
      </div>
    </div>
  );
}