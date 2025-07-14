import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutenticaService {

  private _idAplicacionActual = signal<string>('Esta es la aplicación')
  private _aplicacionActual = signal<string>('')

  private _nombreUsuarioActual = signal<string>('')
  private _idUsuarioActual = signal<string>('')
  private _emailUsuarioActual = signal<string>('')
  private _idSucursalActual = signal<string>('')
  private _rolesUsuarioActual = signal<any>([])
  private _token = signal<string>('')

  actualizarUsuarioActual(id:string,  nombre:string, email:string, idSucursal:string, token:string){
    this._nombreUsuarioActual.set(nombre)
    this._idUsuarioActual.set(id)
    this._emailUsuarioActual.set(email)
    this._idSucursalActual.set(idSucursal)
    this._token.set(token)
  }

  actualizarAplicacionActual(id:string, aplicacion:string){
    this._idAplicacionActual.set(id)
    this._aplicacionActual.set(aplicacion)
  }

  // Exponerlo como solo lectura (opcional)
  readonly idUsuarioActual = this._idUsuarioActual.asReadonly()
  readonly nombreUsuarioActual = this._nombreUsuarioActual.asReadonly()
  readonly emailUsuarioActual = this._emailUsuarioActual.asReadonly()
  readonly idSucursalActual = this._idSucursalActual.asReadonly()
  readonly tokenActual = this._token.asReadonly()
  readonly idAplicacionActual = this._idAplicacionActual.asReadonly()
  readonly aplicacionActual = this._aplicacionActual.asReadonly()
}
