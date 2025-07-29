import { Component, effect, inject } from '@angular/core';
import { MenuHorizontalPrincipalComponent } from '../componentes/compartidos/menu-horizontal-principal/menu-horizontal-principal.component';
import { SeccionesComponent } from '../componentes/compartidos/secciones/secciones.component';
import { ServiciosComponent } from '../componentes/compartidos/servicios/servicios.component';
import { AcercaComponent } from '../componentes/compartidos/acerca/acerca.component';
import { VisionMisionComponent } from '../componentes/compartidos/vision-mision/vision-mision.component';
import { ContactoComponent } from '../componentes/compartidos/contacto/contacto.component';
import { PieComponent } from '../componentes/compartidos/pie/pie.component';
import AOS from 'aos';
import { AutenticaService } from '../servicios/autentica.service';
import { TamanioFormModalService } from '../servicios/tamanio-form-modal.service';


@Component({
  selector: 'app-inicio-infoclic',
  imports: [MenuHorizontalPrincipalComponent, SeccionesComponent, ServiciosComponent,
    AcercaComponent, VisionMisionComponent, ContactoComponent, PieComponent],
  templateUrl: './inicio-infoclic.component.html',
  styleUrl: './inicio-infoclic.component.css'
})
export class InicioInfoclicComponent {
  private autenticaServicio = inject(AutenticaService)
  aplicacionActual = this.autenticaServicio.aplicacionActual

  title = 'front';

  modalForm = inject(TamanioFormModalService)

  constructor(){
    /* effect(() => {
      this.mostrarModalForm = this.modalForm.mostrarModalForm()
      this.mostrarModalCargando = this.modalForm.mostrarModalCargando()
    }); */
  }

  ngOnInit() {
    
    // Inicializar AOS una vez que la aplicación se cargue
    AOS.init({
      duration: 1200, // Duración global para las animaciones
      once: true,     // Si las animaciones deben ejecutarse solo una vez
    });

     history.pushState(null, '', location.href);
    window.onpopstate = () => {
   
  };
  }
}
