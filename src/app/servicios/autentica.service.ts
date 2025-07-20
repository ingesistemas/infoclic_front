import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AutenticaService {

  private _idAplicacionActual = signal<string>('Esta es la aplicación')
  private _aplicacionActual = signal<string>('')
  private _nitActual = signal<string>('')

  private _nombreUsuarioActual = signal<string>('')
  private _idUsuarioActual = signal<string>('')
  private _emailUsuarioActual = signal<string>('')
  private _idSucursalActual = signal<number>(0)
  private _rolesUsuarioActual = signal<any>([])
  private _token = signal<string>('')
  private _aplicacionSelect = signal<string>('')

  actualizarUsuarioActual(id:string,  nombre:string, email:string, idSucursal:number, token:string, nit:string){
    this._nombreUsuarioActual.set(nombre)
    this._idUsuarioActual.set(id)
    this._emailUsuarioActual.set(email)
    this._idSucursalActual.set(idSucursal)
    this._token.set(token)
    this._nitActual.set(nit)
  }

  actualizarAplicacionActual(id:string, aplicacion:string, aplicacionSelect: string ){
    this._idAplicacionActual.set(id)
    this._aplicacionActual.set(aplicacion)
    this._aplicacionSelect.set(aplicacionSelect) //Se guarda la aplicación que se seleccinó en el menú horizontal para tener
    // una referencia, pero que se utiliza para validaciones es id y aplicacion.
  }

  // Exponerlo como solo lectura (opcional)
  readonly idUsuarioActual = this._idUsuarioActual.asReadonly()
  readonly nombreUsuarioActual = this._nombreUsuarioActual.asReadonly()
  readonly emailUsuarioActual = this._emailUsuarioActual.asReadonly()
  readonly idSucursalActual = this._idSucursalActual.asReadonly()
  readonly tokenActual = this._token.asReadonly()
  readonly idAplicacionActual = this._idAplicacionActual.asReadonly()
  readonly aplicacionActual = this._aplicacionActual.asReadonly()
  readonly aplicacionSelect = this._aplicacionSelect.asReadonly()
  readonly nitActual = this._nitActual.asReadonly()
}
