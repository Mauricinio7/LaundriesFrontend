import { useState, useEffect } from "react";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  type Service,
  type CreateServiceData,
} from "../../../shared/lib/service.service";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los servicios"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateServiceData) => {
    try {
      setError(null);
      await createService(data);
      await loadServices();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error al crear el servicio"
      );
    }
  };

  const handleUpdate = async (id: number, data: CreateServiceData) => {
    try {
      setError(null);
      await updateService(id, {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precioPorKilo: data.precioPorKilo,
        activo: data.activo,
      });
      await loadServices();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error al actualizar el servicio"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteService(id);
      await loadServices();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error al eliminar el servicio"
      );
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return {
    services,
    loading,
    error,
    loadServices,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

