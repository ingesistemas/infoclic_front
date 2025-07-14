import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { TamanioFormModalService } from '../../../../servicios/tamanio-form-modal.service';

@Component({
  selector: 'app-modal-cargando',
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './modal-cargando.component.html',
  styleUrl: './modal-cargando.component.css'
})
export class ModalCargandoComponent {
  mostrarModal: boolean = false
  componenteCargando: any = null;
  tamanioForm = inject(TamanioFormModalService)

  constructor(){
    effect(() => {
      this.mostrarModal = this.tamanioForm.mostrarModalCargando()
      this.componenteCargando = this.tamanioForm.componenteCargando();
    });
  }
  ngOnInit(): void {
    
  }


  cerrarModal() { 
    this.tamanioForm.actualizarCargando(false, null)
  }
}
