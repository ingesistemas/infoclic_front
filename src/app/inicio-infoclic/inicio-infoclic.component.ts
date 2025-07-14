import { Component, effect, inject } from '@angular/core';
import { MenuHorizontalPrincipalComponent } from '../componentes/compartidos/menu-horizontal-principal/menu-horizontal-principal.component';
import { SeccionesComponent } from '../componentes/compartidos/secciones/secciones.component';
import { ServiciosComponent } from '../componentes/compartidos/servicios/servicios.component';
import { AcercaComponent } from '../componentes/compartidos/acerca/acerca.component';
import { VisionMisionComponent } from '../componentes/compartidos/vision-mision/vision-mision.component';
import { ContactoComponent } from '../componentes/compartidos/contacto/contacto.component';
import { PieComponent } from '../componentes/compartidos/pie/pie.component';
import { ModalFormComponent } from '../componentes/compartidos/modales/modal-form/modal-form.component';
import AOS from 'aos';
import { AutenticaService } from '../servicios/autentica.service';
import { TamanioFormModalService } from '../servicios/tamanio-form-modal.service';
import { ModalCargandoComponent } from '../componentes/compartidos/modales/modal-cargando/modal-cargando.component';

@Component({
  selector: 'app-inicio-infoclic',
  imports: [MenuHorizontalPrincipalComponent, SeccionesComponent, ServiciosComponent,
    AcercaComponent, VisionMisionComponent, ContactoComponent, PieComponent, ModalFormComponent, ModalCargandoComponent],
  templateUrl: './inicio-infoclic.component.html',
  styleUrl: './inicio-infoclic.component.css'
})
export class InicioInfoclicComponent {
  private autenticaServicio = inject(AutenticaService)
  aplicacionActual = this.autenticaServicio.aplicacionActual

  title = 'front';
  mostrarModalForm: boolean = false
  mostrarModalCargando: boolean = false
  modalForm = inject(TamanioFormModalService)

  constructor(){
    effect(() => {
      this.mostrarModalForm = this.modalForm.mostrarModalForm()
      this.mostrarModalCargando = this.modalForm.mostrarModalCargando()
    });
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
