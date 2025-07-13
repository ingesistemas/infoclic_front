import { Component, effect, inject, OnInit, Signal } from '@angular/core';
import { TamanioFormModalService } from '../../../../servicios/tamanio-form-modal.service';
import { MensajesService } from '../../../../servicios/mensajes.service';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  mensaje: any = ''
  tamanioForm = inject(TamanioFormModalService)
  mensajeServicios = inject(MensajesService)

  constructor(){
  effect(()=>{
      const mensaje = this.mensajeServicios.obtenerMensajeError()()
      this.mensaje = mensaje
    })
  }

  ngOnInit(): void {
   
  }

  cerrarModal(){
    this.tamanioForm.actualizar(false, null)
  }

}
