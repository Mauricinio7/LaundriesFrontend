import React, { useState, useEffect, useRef } from "react";
import type { Client } from "../lib/client.service";

interface SearchBarProps {
  onSelectClient: (client: Client) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectClient,
  onClear,
  placeholder = "Buscar por nombre, teléfono o correo...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce para la búsqueda
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const term = searchTerm.trim();

    if (term.length === 0) {
      setResults([]);
      setShowResults(false);
      setLoading(false);
      return;
    }

    if (term.length < 2) {
      setShowResults(false);
      setLoading(false);
      return;
    }

    setLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const { getAllClients } = await import("../lib/client.service");
        const clients = await getAllClients(term);
        setResults(clients);
        setShowResults(true);
      } catch (error) {
        console.error("Error al buscar clientes:", error);
        setResults([]);
        setShowResults(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchTerm]);

  const handleSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchTerm(`${client.nombre} - ${client.correo}`);
    setShowResults(false);
    onSelectClient(client);
  };

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setSelectedClient(null);
    setShowResults(false);
    onClear();
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {selectedClient && (
          <button onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Buscando...</span>
          </div>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((client) => (
            <button
              key={client.id}
              onClick={() => handleSelect(client)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{client.nombre}</div>
              <div className="text-sm text-gray-600">{client.correo}</div>
              <div className="text-sm text-gray-500">{client.telefono}</div>
            </button>
          ))}
        </div>
      )}

      {showResults && !loading && results.length === 0 && searchTerm.trim().length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-gray-500 text-center">No se encontraron clientes</p>
        </div>
      )}
    </div>
  );
};