import { useState, useEffect } from "react";
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  type Client,
  type CreateClientData,
} from "../../../shared/lib/client.service";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllClients();
      setClients(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los clientes"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateClientData) => {
    try {
      setError(null);
      await createClient(data);
      await loadClients();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error al crear el cliente"
      );
    }
  };

  const handleUpdate = async (id: number, data: CreateClientData) => {
    try {
      setError(null);
      await updateClient(id, data);
      await loadClients();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error al actualizar el cliente"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteClient(id);
      await loadClients();
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Error al eliminar el cliente"
      );
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  return {
    clients,
    loading,
    error,
    loadClients,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

