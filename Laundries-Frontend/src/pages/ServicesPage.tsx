import React, { useState } from "react";
import { useServices } from "../features/services/hooks/useServices";
import { useServiceForm } from "../features/services/hooks/useServiceForm";
import { ServiceTable } from "../features/services/components/ServiceTable";
import { ServiceModal } from "../features/services/components/ServiceModal";
import { LoadingSpinner } from "../features/services/components/LoadingSpinner";
import { ErrorAlert } from "../features/services/components/ErrorAlert";
import type { Service } from "../shared/lib/service.service";

const ServicesPage: React.FC = () => {
  const {
    services,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useServices();

  const {
    formData,
    formErrors,
    validateForm,
    handleInputChange,
    resetForm,
    setFormDataFromService,
  } = useServiceForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (editingService) {
        await handleUpdate(editingService.id, formData);
      } else {
        await handleCreate(formData);
      }

      handleCloseModal();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : `Error al ${editingService ? "actualizar" : "crear"} el servicio`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormDataFromService(service);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar (desactivar) este servicio?"
      )
    ) {
      return;
    }

    try {
      await handleDelete(id);
    } catch (err) {
      // El error se maneja en el hook useServices
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    resetForm();
    setSubmitError(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingService(null);
    resetForm();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Servicios
            </h1>
            <p className="text-gray-600">
              Gestiona los servicios de la lavandería
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Servicio
          </button>
        </div>

        <ErrorAlert message={error || submitError || ""} />

        <ServiceTable
          services={services}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {services.length === 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Crear primer servicio
            </button>
          </div>
        )}

        <ServiceModal
          isOpen={isModalOpen}
          editingService={editingService}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ServicesPage;
