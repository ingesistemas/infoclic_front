export interface ApiResponse<T> {
  Status: number;
  Error: boolean;
  Message: string | any;
  Data?: T; // 'Data' ahora puede ser de cualquier tipo T
}

// Interfaz para los datos específicos de las estadísticas
export interface IEstadisticasData {
  resumen_general: {
    asignados: number;
    cancelados: number;
    atendidos: number;
  };
  por_prioritarias: { nombre: string; cantidad: number; porcentaje: number; promedio: number; }[];
  por_operarios_atendieron: { nombre: string; cantidad: number; porcentaje: number; promedio: number; }[];
  por_usuarios_asignadores: { nombre: string; cantidad: number; porcentaje: number; promedio: number; }[];
  por_salasenatencion: { nombre: string; cantidad: number; porcentaje: number; promedio: number; }[];
  por_modulosenatencion: { nombre: string; cantidad: number; porcentaje: number; promedio: number; }[];
  por_estado_caso: { nombre: string; cantidad: number; porcentaje: number; promedio: number; }[];
  promedios_tiempos_operarios: {
    operario_nombre: string;
    promedio_espera_segundos: number;
    promedio_espera_hms: string;
    promedio_atencion_segundos: number;
    promedio_atencion_hms: string;
    total_turnos_atendidos: number;
  }[];
}