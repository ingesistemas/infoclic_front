export interface IDatoGrafico {
  nombre?: string;
  cantidad?: number;
  porcentaje?: number;
  promedio?: number;

  // Propiedades del nuevo gráfico de totales (opcionales)
  operario_nombre?: string;
  total_atencion_segundos?: number;
  total_atencion_hms?: string;
  total_atencion_horas?: number;
  total_turnos_atendidos?: number;
}