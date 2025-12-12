export type Employee = {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
  dni: string;
  fechaNacimiento: string;
  idSucursal: string;
};

export type CreateEmployeeAccountPayload = {
  email: string;
  password: string;
  role: "EMPLOYEE";
};

export type CreateEmployeeProfilePayload = {
  idEmpleado: string;
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  idSucursal: string;
};