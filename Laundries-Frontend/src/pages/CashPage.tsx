import { useState } from "react";
import { useCash } from "../features/cash/hooks/useCash";

export default function CashPage() {
  const { loading, result, generateCut } = useCash();

  const raw = localStorage.getItem("laundries:auth");
  const auth = raw ? JSON.parse(raw) : null;
  const profile = auth?.profile;

  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    dinero_inicial: 0,
    monto_reportado_por_empleado: 0
  });

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    await generateCut({
      sucursal_id: profile.idSucursal,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      dinero_inicial: Number(form.dinero_inicial),
      monto_reportado_por_empleado: Number(form.monto_reportado_por_empleado)
    });
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Corte de Caja</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4 max-w-md"
      >
        <div>
          <label className="block font-semibold">Fecha Inicio</label>
          <input
            type="date"
            name="fecha_inicio"
            value={form.fecha_inicio}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Fecha Fin</label>
          <input
            type="date"
            name="fecha_fin"
            value={form.fecha_fin}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Dinero inicial</label>
          <input
            type="number"
            name="dinero_inicial"
            value={form.dinero_inicial}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Monto reportado por empleado</label>
          <input
            type="number"
            name="monto_reportado_por_empleado"
            value={form.monto_reportado_por_empleado}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Generando corte..." : "Generar Corte"}
        </button>
      </form>

      {result && (
        <div className="bg-white p-6 rounded-xl shadow max-w-md">
          <h3 className="text-xl font-bold mb-3">Resultado del Corte</h3>

          <p><strong>Total ventas:</strong> ${result.total_ventas}</p>
          <p><strong>Total devoluciones:</strong> ${result.total_devoluciones}</p>
          <p><strong>Dinero inicial:</strong> ${result.dinero_inicial}</p>
          <p><strong>Reportado por empleado:</strong> ${result.monto_reportado_por_empleado}</p>
          <p><strong>Diferencia:</strong> ${result.diferencia}</p>

          <hr className="my-3" />

          <p className="text-sm text-gray-500">
            Corte generado el: {new Date(result.created_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}