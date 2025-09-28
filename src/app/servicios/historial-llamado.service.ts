import { Injectable, signal } from '@angular/core';
import { Ihistorial } from '../interfaces/IHistorialLlamado';

@Injectable({
  providedIn: 'root'
})
export class HistorialLlamadoService {
  private _datosLlamados = signal<Ihistorial[]>([])

  actualizarHistorialLlamado(datos:any){
    this._datosLlamados.set(datos)
  }

  readonly datosLlamados = this._datosLlamados.asReadonly()

  constructor() { }
}
