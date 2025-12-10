export function EmployeesBySucursalModal({
    open,
    branch,
    employees,
    loading,
    onClose,
    onEditEmployee
  }: any) {
    if (!open || !branch) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl w-[500px] space-y-4 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold">
            Empleados de {branch.nombre}
          </h2>
  
          {loading && <p>Cargando empleados...</p>}
  
          {!loading && employees.length === 0 && (
            <p className="text-gray-500">No hay empleados en esta sucursal.</p>
          )}
  
          {employees.map((emp: any) => (
            <div
              key={emp.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{emp.nombre}</p>
                <p className="text-sm text-gray-600">{emp.dni}</p>
              </div>
  
              <button
                onClick={() => onEditEmployee(emp)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Editar
              </button>
            </div>
          ))}
  
          <button
            onClick={onClose}
            className="w-full text-center text-gray-600 underline"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }