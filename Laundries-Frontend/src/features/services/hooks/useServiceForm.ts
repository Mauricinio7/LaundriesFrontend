import { useState } from "react";
import type { Service, CreateServiceData } from "../../../shared/lib/service.service";

export const useServiceForm = () => {
  const [formData, setFormData] = useState<CreateServiceData>({
    nombre: "",
    descripcion: "",
    precioPorKilo: 0,
    activo: true,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateServiceData, string>>>({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateServiceData, string>> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es requerida";
    }

    if (formData.precioPorKilo <= 0) {
      errors.precioPorKilo = "El precio por kilo debe ser mayor a 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | boolean = value;

    if (type === "number") {
      processedValue = parseFloat(value) || 0;
    } else if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (formErrors[name as keyof CreateServiceData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precioPorKilo: 0,
      activo: true,
    });
    setFormErrors({});
  };

  const setFormDataFromService = (service: Service) => {
    setFormData({
      nombre: service.nombre,
      descripcion: service.descripcion,
      precioPorKilo: Number(service.precio_por_kilo),
      activo: service.activo,
    });
  };

  return {
    formData,
    formErrors,
    validateForm,
    handleInputChange,
    resetForm,
    setFormDataFromService,
  };
};

