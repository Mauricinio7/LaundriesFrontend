const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://100.68.70.25:4003";

export interface OrderItem {
  id: number;
  id_venta: string;
  id_servicio: number;
  numero_prendas: number;
  peso_kg: number;
  precio_aplicado: number | string;
  subtotal: number | string;
  detalles_prendas?: string;
  estado: "RECIBIDO" | "LAVANDO" | "LISTO" | "ENTREGADO" | "CANCELADO";
  fecha_entrega_estimada?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sale {
  id: string;
  codigo_recogida: string;
  anotaciones_generales?: string;
  id_cliente: number;
  id_sucursal: number;
  id_empleado: number;
  costo_total: number | string;
  fecha_recepcion: string;
  items?: OrderItem[];
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
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (typeof errorData === "string") {
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
 * Obtiene las ventas activas de una sucursal
 * @param idSucursal - ID de la sucursal (obligatorio)
 * @param idCliente - ID del cliente (opcional, para filtrar)
 */
export const getActiveSales = async (
  idSucursal: string | number,
  idCliente?: string | number
): Promise<Sale[]> => {
  const params = new URLSearchParams({
    idSucursal: String(idSucursal),
  });

  if (idCliente) {
    params.append("idCliente", String(idCliente));
  }

  const response = await fetchWithAuth(`/ordenes/ventas-activas?${params}`);
  const sales: Sale[] = await response.json();
  return sales;
};

/**
 * Obtiene los detalles completos de una venta
 * @param idVenta - ID de la venta (UUID)
 */
export const getSaleDetails = async (idVenta: string): Promise<Sale> => {
  const response = await fetchWithAuth(`/ordenes/venta/${idVenta}`);
  const sale: Sale = await response.json();
  return sale;
};

/**
 * Actualiza el estado de una orden
 */
export const updateOrderStatus = async (
  idOrden: number,
  estado: OrderItem["estado"]
): Promise<OrderItem> => {
  const response = await fetchWithAuth(`/ordenes/item/${idOrden}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  });

  const result: ApiResponse<OrderItem> = await response.json();
  return result.data;
};

export interface CreateOrderData {
  idCliente: number;
  idSucursal: string;
  idEmpleado: string;
  anotaciones?: string;
  items: Array<{
    idServicio: number;
    pesoKg: number;
    numeroPrendas: number;
    detalles?: string;
    fechaEntrega?: string;
  }>;
}

/**
 * Crea una nueva orden/venta
 */
export const createOrder = async (data: CreateOrderData): Promise<Sale> => {
  const response = await fetchWithAuth("/ordenes", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result: ApiResponse<Sale> = await response.json();
  return result.data;
};

/**
 * Cancela una orden con código de autorización
 */
export const cancelOrder = async (
  idOrden: number,
  idSucursal: string,
  codigoAutorizacion: string
): Promise<OrderItem> => {
  const response = await fetchWithAuth(`/ordenes/item/${idOrden}/cancelar`, {
    method: "PATCH",
    body: JSON.stringify({
      idSucursal,
      codigoAutorizacion,
    }),
  });

  const result: ApiResponse<OrderItem> = await response.json();
  return result.data;
};

