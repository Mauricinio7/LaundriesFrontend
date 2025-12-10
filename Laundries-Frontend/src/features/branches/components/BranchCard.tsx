interface Props {
    branch: any;
    onEdit: (branch: any) => void;
    onAddManager: (branch: any) => void;
    onShowEmployees: (branch: any) => void;
  }
  
  export function BranchCard({ branch, onEdit, onAddManager, onShowEmployees }: Props) {
    return (
      <div className="p-4 border rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <p className="font-bold">{branch.nombre}</p>
          <p className="text-sm text-gray-600">{branch.direccion}</p>
        </div>
  
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => onEdit(branch)}
          >
            Editar
          </button>
  
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
            onClick={() => onAddManager(branch)}
          >
            Agregar Gerente
          </button>
  
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            onClick={() => onShowEmployees(branch)}
          >
            Ver empleados
          </button>
        </div>
      </div>
    );
  }