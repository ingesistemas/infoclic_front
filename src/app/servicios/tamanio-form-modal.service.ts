import { Injectable, signal, effect, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TamanioFormModalService {
  mostrarModalForm = signal(false)
  componente = signal<Type<any> | null>(null);
  
  actualizar(mostrar: boolean, componente: Type<any> | null) {
    this.mostrarModalForm.set(mostrar);
    this.componente.set(componente);
  }

  obtenerMostrar(){
    return this.mostrarModalForm
  }

}
