import { useState } from "react";

export function EditEmployeeModal({ open, employee, onClose, onSave }: any) {
  if (!open || !employee) return null;

  const [form, setForm] = useState({
    nombre: employee.nombre,
    direccion: employee.direccion,
    telefono: employee.telefono,
    dni: employee.dni,
    fechaNacimiento: employee.fechaNacimiento.slice(0, 10),
    idSucursal: employee.idSucursal,
  });

  async function handleSave() {
    await onSave(employee.id, form);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
        <h2 className="text-xl font-bold">Editar Empleado</h2>

        {Object.keys(form).map((f) => (
          <input
            key={f}
            value={(form as any)[f]}
            placeholder={f}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            className="w-full border p-2 rounded"
          />
        ))}

        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded"
        >
          Guardar Cambios
        </button>

        <button onClick={onClose} className="w-full text-gray-600 underline">
          Cerrar
        </button>
      </div>
    </div>
  );
}