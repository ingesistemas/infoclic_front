import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TamanioFormModalService } from '../../../../../servicios/tamanio-form-modal.service';
import { VerticalService } from '../../../../../servicios/vertical.service';
import { timeout } from 'rxjs';
declare const bootstrap: any;

@Component({
  selector: 'app-vertical-turnity-admin',
  imports: [RouterLink],
  templateUrl: './vertical-turnity-admin.html',
  styleUrl: './vertical-turnity-admin.css'
})
export class VerticalTurnityAdmin {
  mostrarModalCargando: boolean = false
  modalForm = inject(TamanioFormModalService)
  mostrarVertical = inject(VerticalService)
  private actualizaDatos = inject(TamanioFormModalService)
  
  async actualizarDatos(){
    this.cerrarVertical()
    this.actualizaDatos.actualizar(false, null)
     
  }


  cerrarVertical(){
    
    const offcanvasElement = document.getElementById('offcanvasExample');
    if (offcanvasElement) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement)
        || new bootstrap.Offcanvas(offcanvasElement);
      offcanvasInstance.hide();
    }

  }
}
