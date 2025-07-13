import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHorizontalPrincipalComponent } from "./componentes/compartidos/menu-horizontal-principal/menu-horizontal-principal.component";
import { SeccionesComponent } from "./componentes/compartidos/secciones/secciones.component";
import { ServiciosComponent } from "./componentes/compartidos/servicios/servicios.component";
import { AcercaComponent } from "./componentes/compartidos/acerca/acerca.component";
import { VisionMisionComponent } from "./componentes/compartidos/vision-mision/vision-mision.component";
import { ContactoComponent } from "./componentes/compartidos/contacto/contacto.component";
import { PieComponent } from "./componentes/compartidos/pie/pie.component";
import AOS from 'aos';
import { ModalFormComponent } from "./componentes/compartidos/modales/modal-form/modal-form.component";
import { TamanioFormModalService } from './servicios/tamanio-form-modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuHorizontalPrincipalComponent, SeccionesComponent, ServiciosComponent,
    AcercaComponent, VisionMisionComponent, ContactoComponent, PieComponent, ModalFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'front';
  mostrarModalForm: boolean = false
  modalForm = inject(TamanioFormModalService)

  constructor(){
    effect(() => {
      this.mostrarModalForm = this.modalForm.mostrarModalForm()
    });
  }

  ngOnInit() {
    
    // Inicializar AOS una vez que la aplicación se cargue
    AOS.init({
      duration: 1200, // Duración global para las animaciones
      once: true,     // Si las animaciones deben ejecutarse solo una vez
    });
  }
}
