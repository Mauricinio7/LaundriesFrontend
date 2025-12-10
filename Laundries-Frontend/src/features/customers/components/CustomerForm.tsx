import React from "react";
import type { CreateClientData } from "../../../shared/lib/client.service";

interface CustomerFormProps {
  formData: CreateClientData;
  formErrors: Partial<CreateClientData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  formErrors,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formErrors.nombre ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nombre del cliente"
        />
        {formErrors.nombre && (
          <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="telefono"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teléfono *
        </label>
        <input
          type="text"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formErrors.telefono ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Teléfono del cliente"
        />
        {formErrors.telefono && (
          <p className="mt-1 text-sm text-red-600">{formErrors.telefono}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="correo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Correo *
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formErrors.correo ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="correo@ejemplo.com"
        />
        {formErrors.correo && (
          <p className="mt-1 text-sm text-red-600">{formErrors.correo}</p>
        )}
      </div>
    </div>
  );
};

