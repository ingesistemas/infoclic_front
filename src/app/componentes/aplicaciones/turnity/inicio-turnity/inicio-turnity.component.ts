import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HortizontalTurnityComponent } from "../compartidos/hortizontal-turnity/hortizontal-turnity.component";
import { VerticalTurnityAdmin } from "../compartidos/vertical-turnity-admin/vertical-turnity-admin";
import { TamanioFormModalService } from '../../../../servicios/tamanio-form-modal.service';
import { VerticalService } from '../../../../servicios/vertical.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio-turnity',
  imports: [RouterOutlet, HortizontalTurnityComponent, VerticalTurnityAdmin],
  templateUrl: './inicio-turnity.component.html',
  styleUrl: './inicio-turnity.component.css'
})
export class InicioTurnityComponent implements AfterViewInit {
   router = inject(Router);

  isLlamadoPantalla(): boolean {
    return this.router.url.includes('/llamado-pantalla');
  }
  
  private cdr = inject(ChangeDetectorRef)
  mostrarVerticalServicio = inject(VerticalService)
  mostrarModalForm: boolean = false
  mostrarModalCargando: boolean = false
  ngOnInit(): void {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      let confirma = confirm('Has dado clic hacia atrás. Por temas de seguridad las aplicaciones dde Infoclic, no permiten esta acción. Si confirmas esta acción se cerrará la sesión automáticamente dirigiéndolo a la página inicial.')

      if (confirma){
        window.location.href = '';
      }
       
    };
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges()
  }
}
