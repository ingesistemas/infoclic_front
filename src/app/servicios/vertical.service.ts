import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VerticalService {
  private _mostrarVerticalTurnity = signal(false)

  actualizarVerticalTurnity(valor:boolean){
    this._mostrarVerticalTurnity.set(valor)
  }
   readonly mostrarVerticalTurnity = this._mostrarVerticalTurnity.asReadonly()
}
