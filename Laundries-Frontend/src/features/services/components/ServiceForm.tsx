import React from "react";
import type { CreateServiceData } from "../../../shared/lib/service.service";

interface ServiceFormProps {
  formData: CreateServiceData;
  formErrors: Partial<Record<keyof CreateServiceData, string>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
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
          placeholder="Nombre del servicio"
        />
        {formErrors.nombre && (
          <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descripción *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formErrors.descripcion ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Descripción del servicio"
        />
        {formErrors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{formErrors.descripcion}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="precioPorKilo"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Precio por Kilo *
        </label>
        <input
          type="number"
          id="precioPorKilo"
          name="precioPorKilo"
          value={formData.precioPorKilo}
          onChange={onChange}
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formErrors.precioPorKilo ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="0.00"
        />
        {formErrors.precioPorKilo && (
          <p className="mt-1 text-sm text-red-600">
            {formErrors.precioPorKilo}
          </p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="activo"
          name="activo"
          checked={formData.activo}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="activo"
          className="ml-2 block text-sm text-gray-700"
        >
          Servicio activo
        </label>
      </div>
    </div>
  );
};

