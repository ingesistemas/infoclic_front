import { Routes } from '@angular/router';
import { InicioInfoclicComponent } from '../../inicio-infoclic/inicio-infoclic.component';
import { AuthGuard } from '../../guards/auth.guard';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { CrearEditarSucursalComponent } from './sucursales/crear-editar-sucursal/crear-editar-sucursal.component';
import { ObtenerPisosComponent } from './pisos/obtener-pisos/obtener-pisos.component';
import { CrearEditarPisoComponent } from './pisos/crear-editar-piso/crear-editar-piso.component';

export const configuracionGeneral: Routes = [

    {
        path: 'sucursales',
        component: SucursalesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-sucursal',
        component: CrearEditarSucursalComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'pisos',
        component: ObtenerPisosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-piso',
        component: CrearEditarPisoComponent,
        canActivate: [AuthGuard]
    },
];
