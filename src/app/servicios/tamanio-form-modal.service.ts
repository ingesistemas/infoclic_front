import { Injectable, signal, effect, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TamanioFormModalService {
  mostrarModalForm = signal(false)
  componente = signal<Type<any> | null>(null);
  _accion = signal('')

  mostrarModalCargando= signal(false)
  componenteCargando = signal<Type<any> | null>(null);

  actualizar(mostrar: boolean, componente: Type<any> | null, accion?: string) {
    this.mostrarModalForm.set(mostrar);
    this.componente.set(componente);
    if (accion !== undefined) {
      this._accion.set(accion);
    }else{
      this._accion.set('');
    }
  }

  actualizarCargando(mostrar: boolean, componente: Type<any> | null) {
    this.mostrarModalCargando.set(mostrar);
    this.componenteCargando.set(componente);
  }

  readonly accionActual = this._accion.asReadonly()
}
