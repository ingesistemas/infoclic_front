import { Routes } from '@angular/router';
import { AsignarTurnoComponent } from './turnos/asignar-turno/asignar-turno.component';
import { AuthGuard } from '../../../guards/auth.guard';
import { LlamadoOperarioComponent } from './turnos/llamado-operario/llamado-operario.component';
import { DiligenciarLlamadosComponent } from './diligenciar-llamados/diligenciar-llamados.component';
import { LlamadoPantallaComponent } from './turnos/llamado-pantalla/llamado-pantalla.component';
import { ListadoTurnosDiariosComponent } from './turnos/listado-turnos-diarios/listado-turnos-diarios.component';
import { TurnosFechasComponent } from './turnos/turnos-fechas/turnos-fechas.component';
import { EstadisticasFechasComponent } from './turnos/estadisticas-fechas/estadisticas-fechas.component';
import { AsignarTurnoPantallaComponent } from './turnos/asignar-turno-pantalla/asignar-turno-pantalla.component';
import { LlamadoSalasComponent } from './turnos/llamado-salas/llamado-salas.component';
import { LlamadoPantalla2Component } from './turnos/llamado-pantalla2/llamado-pantalla2.component';
import { ConsultarComponent } from './turnos/estadisticas/consultar/consultar.component';
import { DashboardComponent } from './turnos/estadisticas/dashboard/dashboard.component';


export const turnityGeneral: Routes = [
    {
        path: 'crear-turno',
        component: AsignarTurnoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-turno-pantalla',
        component: AsignarTurnoPantallaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'llamado-operario',
        component: LlamadoOperarioComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'llamado-salas',
        component: LlamadoSalasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'diligenciar-llamados',
        component: DiligenciarLlamadosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'llamado-pantalla',
        //component: LlamadoPantallaComponent,
        component: LlamadoPantalla2Component,
        canActivate: [AuthGuard]
    },
    {
        path: 'listado-turnos-diarios',
        component: ListadoTurnosDiariosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'turnos-fechas',
        component: TurnosFechasComponent ,
        canActivate: [AuthGuard]
    },
    {
        path: 'estadisticas-fechas',
        component: EstadisticasFechasComponent ,
        canActivate: [AuthGuard]
    },
    {
        path: 'estadisticas',
        component: ConsultarComponent ,
        canActivate: [AuthGuard]
    },
    {
        path: 'infoEstadisticas',
        component: DashboardComponent ,
        canActivate: [AuthGuard]
    },
];

