import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalFormComponent } from './componentes/compartidos/modales/modal-form/modal-form.component';
import { ModalCargandoComponent } from './componentes/compartidos/modales/modal-cargando/modal-cargando.component';
import { TamanioFormModalService } from './servicios/tamanio-form-modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalFormComponent, ModalCargandoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit  {
  private cdr = inject(ChangeDetectorRef)
 
  modalForm = inject(TamanioFormModalService)

  
  ngAfterViewInit(): void {
    this.cdr.detectChanges()
  }
}
