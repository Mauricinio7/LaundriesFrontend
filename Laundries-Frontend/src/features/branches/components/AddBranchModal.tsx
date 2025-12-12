import { useState, useEffect } from "react";

export function AddBranchModal({ open, onClose, onCreate }: any) {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    telefono: ""
  });

  useEffect(() => {
    if (open) {
      setForm({
        nombre: "",
        direccion: "",
        telefono: ""
      });
    }
  }, [open]);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    onCreate(form);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow w-96">
        <h2 className="text-xl font-bold mb-4">Agregar Sucursal</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <input
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}