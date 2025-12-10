import React, { useState } from "react";
import { useAuth } from "../features/Login/AuthProvider";
import { useClients } from "../features/customers/hooks/useClients";
import { useCustomerForm } from "../features/customers/hooks/useCustomerForm";
import { CustomerTable } from "../features/customers/components/CustomerTable";
import { CustomerModal } from "../features/customers/components/CustomerModal";
import { LoadingSpinner } from "../features/customers/components/LoadingSpinner";
import { ErrorAlert } from "../features/customers/components/ErrorAlert";
import type { Client } from "../shared/lib/client.service";

const CustomersPage: React.FC = () => {
  const { user } = useAuth();
  const {
    clients,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useClients();

  const {
    formData,
    formErrors,
    validateForm,
    handleInputChange,
    resetForm,
    setFormDataFromClient,
  } = useCustomerForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (editingClient) {
        await handleUpdate(editingClient.id, formData);
      } else {
        await handleCreate(formData);
      }

      handleCloseModal();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : `Error al ${editingClient ? "actualizar" : "crear"} el cliente`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormDataFromClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      return;
    }

    try {
      await handleDelete(id);
    } catch (err) {
      // El error se maneja en el hook useClients
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    resetForm();
    setSubmitError(null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingClient(null);
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
            <p className="text-gray-600">
              Gestiona los clientes de tu lavandería
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
            Nuevo Cliente
          </button>
        </div>

        <ErrorAlert message={error || submitError || ""} />

        <CustomerTable
          clients={clients}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isAdmin={isAdmin}
        />

        {clients.length === 0 && (
          <div className="mt-4 text-center">
            <button
              onClick={handleOpenModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
            >
              Crear primer cliente
            </button>
          </div>
        )}

        <CustomerModal
          isOpen={isModalOpen}
          editingClient={editingClient}
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

export default CustomersPage;
