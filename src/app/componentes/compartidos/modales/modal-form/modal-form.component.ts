import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { TamanioFormModalService } from '../../../../servicios/tamanio-form-modal.service';

@Component({
  selector: 'app-modal-form',
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.css'
})
export class ModalFormComponent implements OnInit {
  mostrarModal: boolean = false
  componente: any = null;
  tamanioForm = inject(TamanioFormModalService)

  constructor(){
    effect(() => {
      this.mostrarModal = this.tamanioForm.mostrarModalForm()
      this.componente = this.tamanioForm.componente();
    });
  }
  ngOnInit(): void {
    
  }


  cerrarModal() { 
    this.tamanioForm.actualizar(false, null)
  }

}
