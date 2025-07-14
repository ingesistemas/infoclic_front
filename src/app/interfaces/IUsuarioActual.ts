interface IUsuarioActual {
  id: number;
  nombre: string;
  email: string;
  activo: number;
  roles: any[];
  id_sucursal: string;
  sucursales: any[];
  token:string;
}