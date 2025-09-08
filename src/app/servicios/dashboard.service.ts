import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }
  fetchDataSimulation(): Observable<any> {
    const datosSimulados = {
      resumen_general:this._resumen_general.getValue()
    }
    return of(datosSimulados);
  }

  /* fetchDataSimulation(): Observable<any> {
    const datosSimulados = {
      resumen_general: {
          asignados: 1250,
          cancelados: 120,
          atendidos: 1130,
          promedio_atencion_global: 540
      },
      por_prioritarias: [
          { nombre: "Alta", cantidad: 450, porcentaje: 36, promedio: 0.36 },
          { nombre: "Media", cantidad: 600, porcentaje: 48, promedio: 0.48 },
          { nombre: "Baja", cantidad: 200, porcentaje: 16, promedio: 0.16 },
      ],
      por_operarios_atendieron: [
          { nombre: "Juan Pérez", cantidad: 350, porcentaje: 30.97, promedio: 0.31 },
          { nombre: "Ana Gómez", cantidad: 480, porcentaje: 42.48, promedio: 0.42 },
          { nombre: "Luis García", cantidad: 300, porcentaje: 26.55, promedio: 0.27 },
          { nombre: "María Lópe", cantidad: 100, porcentaje: 8.85, promedio: 0.09 },
      ],
      por_profesiones: [
          { nombre: "Médico", cantidad: 500, porcentaje: 44.25, promedio: 0.44 },
          { nombre: "Enfermero", cantidad: 400, porcentaje: 35.40, promedio: 0.35 },
          { nombre: "Psicólogo", cantidad: 230, porcentaje: 20.35, promedio: 0.20 },
      ],
      por_estado_caso: [
          { nombre: "Atendido", cantidad: 1130, porcentaje: 90.4, promedio: 0.90 },
          { nombre: "Cancelado", cantidad: 120, porcentaje: 9.6, promedio: 0.10 },
          { nombre: "Pendiente", cantidad: 50, porcentaje: 4, promedio: 0.04 },
      ],
      promedios_tiempos_operarios: [
          { operario_nombre: "Juan Pérez", promedio_espera_segundos: 180, promedio_espera_hms: "00:03:00", promedio_atencion_segundos: 600, promedio_atencion_hms: "00:10:00", total_turnos_atendidos: 350 },
          { operario_nombre: "Ana Gómez", promedio_espera_segundos: 120, promedio_espera_hms: "00:02:00", promedio_atencion_segundos: 480, promedio_atencion_hms: "00:08:00", total_turnos_atendidos: 480 },
          { operario_nombre: "Luis García", promedio_espera_segundos: 240, promedio_espera_hms: "00:04:00", promedio_atencion_segundos: 720, promedio_atencion_hms: "00:12:00", total_turnos_atendidos: 300 },
          { operario_nombre: "María López", promedio_espera_segundos: 90, promedio_espera_hms: "00:01:30", promedio_atencion_segundos: 360, promedio_atencion_hms: "00:06:00", total_turnos_atendidos: 100 },
      ],
      promedios_tiempo_recepcion_asignacion_por_usuario: [
          { usuario_nombre: "Admin", promedio_segundos: 90, promedio_hms: "00:01:30", total_turnos_procesados: 800 },
          { usuario_nombre: "Supervisor", promedio_segundos: 150, promedio_hms: "00:02:30", total_turnos_procesados: 450 },
          { usuario_nombre: "Gestor A", promedio_segundos: 120, promedio_hms: "00:02:00", total_turnos_procesados: 300 },
      ],
      por_modulosenatencion: [
          { nombre: "Atendido", cantidad: 1130, porcentaje: 90.4, promedio: 0.90 },
          { nombre: "Cancelado", cantidad: 120, porcentaje: 9.6, promedio: 0.10 },
          { nombre: "Pendiente", cantidad: 50, porcentaje: 4, promedio: 0.04 },
      ],
      por_salasenatencion: [
          { nombre: "Atendido", cantidad: 1130, porcentaje: 90.4, promedio: 0.90 },
          { nombre: "Cancelado", cantidad: 120, porcentaje: 9.6, promedio: 0.10 },
          { nombre: "Pendiente", cantidad: 50, porcentaje: 4, promedio: 0.04 },
      ],
      por_usuarios_asignadores: [
          { nombre: "Atendido", cantidad: 1130, porcentaje: 90.4, promedio: 0.90 },
          { nombre: "Cancelado", cantidad: 120, porcentaje: 9.6, promedio: 0.10 },
          { nombre: "Pendiente", cantidad: 50, porcentaje: 4, promedio: 0.04 },
      ],
      totales_tiempos_operarios:[
        {operario_nombre: "Dylan Ruiz", total_atencion_hms:"00:00:19",total_atencion_horas:0.01, total_atencion_segundos:19,total_turnos_atendidos: 1}
      ]
    };

    return of(datosSimulados);
  } */
  private _dashboardData = new BehaviorSubject<any>(null);
  private _resumen_general = new BehaviorSubject<any>(null)
  private _por_prioritarias = new BehaviorSubject<any>(null)
  private _por_profesiones = new BehaviorSubject<any>(null)
  private _por_operarios_atendieron = new BehaviorSubject<any>(null)
  private _por_estado_caso = new BehaviorSubject<any>(null)
  private _promedios_tiempos_operarios = new BehaviorSubject<any>(null)
  private _promedios_tiempo_recepcion_asignacion_por_usuario = new BehaviorSubject<any>(null)
  private _por_modulosenatencion = new BehaviorSubject<any>(null)
  private _por_salasenatencion = new BehaviorSubject<any>(null)
  private _por_usuarios_asignadores = new BehaviorSubject<any>(null)
  private _totales_tiempos_operarios = new BehaviorSubject<any>(null)

  public dashboardData$ = this._dashboardData.asObservable();
  public resumen_general$ = this._resumen_general.asObservable();

  public updateDashboardData(data: any): void {
    // Emite los nuevos datos a todos los suscriptores.
    this._dashboardData.next(data);
    this._resumen_general.next(data.datos.resumen_general);
    this._por_prioritarias.next(data.datos._por_prioritarias);
    this._por_profesiones.next(data.datos._por_profesiones);
    this._por_operarios_atendieron.next(data.datos._por_operarios_atendieron)
    this._por_estado_caso.next(data.datos._por_estado_caso);
    this._promedios_tiempos_operarios.next(data.datos._promedios_tiempos_operarios);
    this._promedios_tiempo_recepcion_asignacion_por_usuario.next(data.datos._promedios_tiempo_recepcion_asignacion_por_usuario);
    this._por_modulosenatencion.next(data.datos._por_modulosenatencion);
    this._por_salasenatencion.next(data.datos._por_salasenatencion);
    this._por_usuarios_asignadores.next(data.datos._por_usuarios_asignadores);
    this._totales_tiempos_operarios.next(data.datos._totales_tiempos_operarios);
  }

  
}
