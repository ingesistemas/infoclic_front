import { Injectable, signal } from '@angular/core';
import { IDatoGrafico } from '../interfaces/IDatoGrafico';


@Injectable({
  providedIn: 'root'
})
export class DatosGraficoService {

  private _datosGrafico = signal<IDatoGrafico[]>([])
  private _tituloGrafico = signal<string>('')
  private _tipo = signal<string>('')
  
  
  actualizarDatosGrafico(datos:any, titulo: string, tipo: string){
    this._datosGrafico.set(datos)
    this._tituloGrafico.set(titulo)
    this._tipo.set(tipo)
  }

  readonly datosGrafico = this._datosGrafico.asReadonly()
  readonly tituloGrafico = this._tituloGrafico.asReadonly()
  readonly tipoGrafico = this._tipo.asReadonly()
}
