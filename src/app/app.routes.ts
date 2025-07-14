import { Routes } from '@angular/router';
import { InicioTurnityComponent } from './componentes/aplicaciones/turnity/inicio-turnity/inicio-turnity.component';
import { IngresarEmpresaComponent } from './componentes/ingresar-empresa/ingresar-empresa.component';
import { InicioInfoclicComponent } from './inicio-infoclic/inicio-infoclic.component';
import { AuthGuard } from './guards/auth.guard';
import { configuracionGeneral } from './componentes/configuracion-general/configuracion-general.routes';

export const routes: Routes = [
    {
        path: '',
        component: InicioInfoclicComponent,
    },
    {
    path: 'turnity',
        component: InicioTurnityComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'configuracion-general',
                children: configuracionGeneral
            }
        ]
    }

];
