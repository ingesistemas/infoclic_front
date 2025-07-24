import { Routes } from '@angular/router';
import { AsignarTurnoComponent } from './turnos/asignar-turno/asignar-turno.component';
import { AuthGuard } from '../../../guards/auth.guard';
import { LlamadoOperarioComponent } from './turnos/llamado-operario/llamado-operario.component';
import { DiligenciarLlamadosComponent } from './diligenciar-llamados/diligenciar-llamados.component';
import { LlamadoPantallaComponent } from './turnos/llamado-pantalla/llamado-pantalla.component';
import { ListadoTurnosDiariosComponent } from './turnos/listado-turnos-diarios/listado-turnos-diarios.component';


export const turnityGeneral: Routes = [
    {
        path: 'crear-turno',
        component: AsignarTurnoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'llamado-operario',
        component: LlamadoOperarioComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'diligenciar-llamados',
        component: DiligenciarLlamadosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'llamado-pantalla',
        component: LlamadoPantallaComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'listado-turnos-diarios',
        component: ListadoTurnosDiariosComponent,
        canActivate: [AuthGuard]
    },
];

