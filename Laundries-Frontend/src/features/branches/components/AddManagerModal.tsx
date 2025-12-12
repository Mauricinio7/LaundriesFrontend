import { useState } from "react";

interface AddManagerModalProps {
  open: boolean;
  branch: any;
  onClose: () => void;
  onCreate: (payload: {
    email: string;
    password: string;
    nombre: string;
    direccion: string;
    telefono: string;
    dni: string;
    fechaNacimiento: string;
  }) => Promise<void>; 
}

export function AddManagerModal({
  open,
  branch,
  onClose,
  onCreate,
}: AddManagerModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const [loading, setLoading] = useState(false);

  if (!open || !branch) return null;

  async function handleSubmit() {
    if (!email || !password || !nombre || !dni || !fechaNacimiento) {
      alert("Faltan datos obligatorios");
      return;
    }

    try {
      setLoading(true);

      await onCreate({
        email,
        password,
        nombre,
        direccion,
        telefono,
        dni,
        fechaNacimiento,
      });

      onClose(); 
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el gerente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 space-y-4">
        <h2 className="text-xl font-bold">Registrar Gerente</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancelar
          </button>

          <button
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={handleSubmit}
          >
            {loading ? "Creando..." : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}