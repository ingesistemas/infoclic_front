import { Routes } from '@angular/router';
import { InicioTurnityComponent } from './componentes/aplicaciones/turnity/inicio-turnity/inicio-turnity.component';
import { IngresarEmpresaComponent } from './componentes/ingresar-empresa/ingresar-empresa.component';
import { InicioInfoclicComponent } from './inicio-infoclic/inicio-infoclic.component';

export const routes: Routes = [
    {
        path: '',
        component: InicioInfoclicComponent
    },
    {
        path: 'turnity',
        component: InicioTurnityComponent
    },
    {
        path: 'usuario',
        component: IngresarEmpresaComponent
    }
];
