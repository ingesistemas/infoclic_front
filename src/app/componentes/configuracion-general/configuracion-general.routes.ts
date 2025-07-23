import { Routes } from '@angular/router';
import { InicioInfoclicComponent } from '../../inicio-infoclic/inicio-infoclic.component';
import { AuthGuard } from '../../guards/auth.guard';
import { SucursalesComponent } from './sucursales/sucursales.component';
import { CrearEditarSucursalComponent } from './sucursales/crear-editar-sucursal/crear-editar-sucursal.component';
import { ObtenerPisosComponent } from './pisos/obtener-pisos/obtener-pisos.component';
import { CrearEditarPisoComponent } from './pisos/crear-editar-piso/crear-editar-piso.component';
import { ObtenerSalasComponent } from './salas/obtener-salas/obtener-salas.component';
import { CrearEditarSalasComponent } from './salas/crear-editar-salas/crear-editar-salas.component';
import { ObtenerProfesionesComponent } from './profesiones/obtener-profesiones/obtener-profesiones.component';
import { CrearEditarProfesionesComponent } from './profesiones/crear-editar-profesiones/crear-editar-profesiones.component';
import { ObtenerOperariosComponent } from './operarios/obtener-operarios/obtener-operarios.component';
import { CrearEditarOperariosComponent } from './operarios/crear-editar-operarios/crear-editar-operarios.component';
import { EditarClaveComponent } from '../ingresar-empresa/editar-clave/editar-clave.component';
import { ObtenerCentrosComponent } from './centros/obtener-centros/obtener-centros.component';
import { CrearEditarCentrosComponent } from './centros/crear-editar-centros/crear-editar-centros.component';
import { ObtenerModulosComponent } from './modulos/obtener-modulos/obtener-modulos.component';
import { CrearEditarModulosComponent } from './modulos/crear-editar-modulos/crear-editar-modulos.component';
import { ObtenerClientesComponent } from './clientes/obtener-clientes/obtener-clientes.component';
import { CrearEditarClientesComponent } from './clientes/crear-editar-clientes/crear-editar-clientes.component';
import { AsignarTurnoComponent } from '../aplicaciones/turnity/turnos/asignar-turno/asignar-turno.component';

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
    {
        path: 'salas',
        component: ObtenerSalasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-sala',
        component: CrearEditarSalasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profesiones',
        component: ObtenerProfesionesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-profesion',
        component: CrearEditarProfesionesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'operarios',
        component: ObtenerOperariosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-operario',
        component: CrearEditarOperariosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'editar-credenciales',
        component: EditarClaveComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'centros',
        component: ObtenerCentrosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-centro',
        component: CrearEditarCentrosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'modulos',
        component: ObtenerModulosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-modulo',
        component: CrearEditarModulosComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'clientes',
        component: ObtenerClientesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'crear-cliente',
        component: CrearEditarClientesComponent,
        canActivate: [AuthGuard]
    }
];
