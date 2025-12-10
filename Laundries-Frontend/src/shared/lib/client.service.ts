const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://100.68.70.25:4002";

export interface Client {
  id: number;
  nombre: string;
  telefono: string;
  correo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientData {
  nombre: string;
  telefono: string;
  correo: string;
}

export interface UpdateClientData {
  nombre?: string;
  telefono?: string;
  correo?: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * Obtiene el token de autenticación del localStorage
 */
const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem("laundries:auth");
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.accessToken || null;
    }
  } catch {
    return null;
  }
  return null;
};

/**
 * Realiza una petición autenticada a la API
 */
const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response;
};

/**
 * Crea un nuevo cliente
 */
export const createClient = async (
  data: CreateClientData
): Promise<Client> => {
  const response = await fetchWithAuth("/clientes", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Client> = await response.json();
  return result.data;
};

/**
 * Obtiene todos los clientes
 */
export const getAllClients = async (): Promise<Client[]> => {
  const response = await fetchWithAuth("/clientes");
  // El backend devuelve directamente el array según el controller
  const clients: Client[] = await response.json();
  return clients;
};

/**
 * Obtiene un cliente por ID
 */
export const getClient = async (id: number): Promise<Client> => {
  const response = await fetchWithAuth(`/clientes/${id}`);
  const result: ApiResponse<Client> = await response.json();
  return result.data;
};

/**
 * Actualiza un cliente
 */
export const updateClient = async (
  id: number,
  data: UpdateClientData
): Promise<Client> => {
  const response = await fetchWithAuth(`/clientes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Client> = await response.json();
  return result.data;
};

/**
 * Elimina un cliente
 */
export const deleteClient = async (id: number): Promise<void> => {
  await fetchWithAuth(`/clientes/${id}`, {
    method: "DELETE",
  });
};

