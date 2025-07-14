import { Routes } from '@angular/router';
import { InicioTurnityComponent } from '../aplicaciones/turnity/inicio-turnity/inicio-turnity.component';
import { InicioInfoclicComponent } from '../../inicio-infoclic/inicio-infoclic.component';
import { AuthGuard } from '../../guards/auth.guard';
import { SucursalesComponent } from './sucursales/sucursales.component';

export const configuracionGeneral: Routes = [

    {
        path: 'sucursales',
        component: SucursalesComponent,
        canActivate: [AuthGuard]
    },

];
