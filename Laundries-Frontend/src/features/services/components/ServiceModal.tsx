import React from "react";
import type {
  Service,
  CreateServiceData,
} from "../../../shared/lib/service.service";
import { ServiceForm } from "./ServiceForm";

interface ServiceModalProps {
  isOpen: boolean;
  editingService: Service | null;
  formData: CreateServiceData;
  formErrors: Partial<Record<keyof CreateServiceData, string>>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  editingService,
  formData,
  formErrors,
  isSubmitting,
  onClose,
  onSubmit,
  onInputChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingService ? "Editar Servicio" : "Nuevo Servicio"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <ServiceForm
              formData={formData}
              formErrors={formErrors}
              onChange={onInputChange}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Guardando..."
                  : editingService
                  ? "Actualizar"
                  : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

