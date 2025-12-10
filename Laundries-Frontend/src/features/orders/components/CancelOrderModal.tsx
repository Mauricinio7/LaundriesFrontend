import React, { useState } from "react";

interface CancelOrderModalProps {
  isOpen: boolean;
  orderId: number;
  orderDetails: string;
  onClose: () => void;
  onConfirm: (codigoAutorizacion: string) => Promise<void>;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  orderId,
  orderDetails,
  onClose,
  onConfirm,
}) => {
  const [codigo, setCodigo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!codigo.trim()) {
      setError("El código de autorización es requerido");
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(codigo.trim());
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cancelar la orden"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCodigo("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Cancelar Orden
            </h2>
            <button
              onClick={handleClose}
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

          <p className="text-gray-600 mb-4">
            {orderDetails}
          </p>

          <p className="text-sm text-gray-700 mb-4">
            Para cancelar esta orden, necesitas el código de autorización del
            gerente.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Autorización *
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingresa el código"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Cancelando..." : "Confirmar Cancelación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

