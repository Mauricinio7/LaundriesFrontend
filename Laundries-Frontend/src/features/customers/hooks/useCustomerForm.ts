import { useState } from "react";
import type { Client, CreateClientData } from "../../../shared/lib/client.service";

export const useCustomerForm = () => {
  const [formData, setFormData] = useState<CreateClientData>({
    nombre: "",
    telefono: "",
    correo: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<CreateClientData>>({});

  const validateForm = (): boolean => {
    const errors: Partial<CreateClientData> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es requerido";
    }

    if (!formData.correo.trim()) {
      errors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = "El correo no es válido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CreateClientData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      telefono: "",
      correo: "",
    });
    setFormErrors({});
  };

  const setFormDataFromClient = (client: Client) => {
    setFormData({
      nombre: client.nombre,
      telefono: client.telefono,
      correo: client.correo,
    });
  };

  return {
    formData,
    formErrors,
    validateForm,
    handleInputChange,
    resetForm,
    setFormDataFromClient,
  };
};

