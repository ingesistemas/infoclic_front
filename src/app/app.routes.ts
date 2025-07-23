import { Routes } from '@angular/router';
import { InicioTurnityComponent } from './componentes/aplicaciones/turnity/inicio-turnity/inicio-turnity.component';
import { IngresarEmpresaComponent } from './componentes/ingresar-empresa/ingresar-empresa.component';
import { InicioInfoclicComponent } from './inicio-infoclic/inicio-infoclic.component';
import { AuthGuard } from './guards/auth.guard';
import { configuracionGeneral } from './componentes/configuracion-general/configuracion-general.routes';
import { turnityGeneral } from './componentes/aplicaciones/turnity/turnity.routes';

export const routes: Routes = [
    {
        path: '',
        component: InicioInfoclicComponent,
    },
    {
    path: 'infoclic',
        component: InicioTurnityComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'configuracion-general',
                children: configuracionGeneral
            }
        ]
    },
    {
    path: 'turnity',
        component: InicioTurnityComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'turnity-general',
                children: turnityGeneral
            }
        ]
    }
    

];
