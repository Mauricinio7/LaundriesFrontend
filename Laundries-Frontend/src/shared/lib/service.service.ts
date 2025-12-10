const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://100.68.70.25:4001";

export interface Service {
  id: number;
  nombre: string;
  descripcion: string;
  precio_por_kilo: number | string; // Puede venir como string desde Sequelize DECIMAL
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceData {
  nombre: string;
  descripcion: string;
  precioPorKilo: number;
  activo: boolean;
}

export interface UpdateServiceData {
  nombre?: string;
  descripcion?: string;
  precioPorKilo?: number;
  activo?: boolean;
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
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      // El backend puede devolver el error en diferentes formatos
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    
    throw new Error(errorMessage);
  }

  return response;
};

/**
 * Crea un nuevo servicio
 */
export const createService = async (
  data: CreateServiceData
): Promise<Service> => {
  const response = await fetchWithAuth("/servicios", {
    method: "POST",
    body: JSON.stringify({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precioPorKilo: data.precioPorKilo,
      activo: data.activo,
    }),
  });

  const result: ApiResponse<Service> = await response.json();
  return result.data;
};

/**
 * Obtiene todos los servicios
 */
export const getAllServices = async (): Promise<Service[]> => {
  const response = await fetchWithAuth("/servicios");
  // El backend devuelve directamente el array según el controller
  const services: Service[] = await response.json();
  return services;
};

/**
 * Actualiza un servicio
 */
export const updateService = async (
  id: number,
  data: UpdateServiceData
): Promise<Service> => {
  const updatePayload: Record<string, unknown> = {};
  if (data.nombre !== undefined) updatePayload.nombre = data.nombre;
  if (data.descripcion !== undefined)
    updatePayload.descripcion = data.descripcion;
  if (data.precioPorKilo !== undefined)
    updatePayload.precioPorKilo = data.precioPorKilo;
  if (data.activo !== undefined) updatePayload.activo = data.activo;

  const response = await fetchWithAuth(`/servicios/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatePayload),
  });

  const result: ApiResponse<Service> = await response.json();
  return result.data;
};

/**
 * Elimina un servicio (soft delete - desactiva)
 */
export const deleteService = async (id: number): Promise<void> => {
  await fetchWithAuth(`/servicios/${id}`, {
    method: "DELETE",
  });
};

