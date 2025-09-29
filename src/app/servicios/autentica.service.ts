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
  private _sucursalActual = signal<string>('')
  private _idRolActual = signal<any>([])
  private _token = signal<string>('')
  private _aplicacionSelect = signal<string>('')
  private _idModuloActual = signal<number>(0)
  private _moduloActual = signal<string>('')
  private _idSalaActual = signal<number>(0)
  private _salaActual = signal<string>('')
  

  actualizarUsuarioActual(id:string,  nombre:string, email:string, idSucursal:number, token:string, nit:string, sucursal: string, 
    id_modulo:number, modulo:string, id_sala:number, sala:string, id_rol: string){
    this._nombreUsuarioActual.set(nombre)
    this._idUsuarioActual.set(id)
    this._emailUsuarioActual.set(email)
    this._idSucursalActual.set(idSucursal)
    this._token.set(token)
    this._nitActual.set(nit)
    this._sucursalActual.set(sucursal)
    this._idModuloActual.set(id_modulo)
    this._moduloActual.set(modulo)
    this._idSalaActual.set(id_sala)
    this._salaActual.set(sala)
    this._idRolActual.set(id_rol)
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
  readonly sucursalActual = this._sucursalActual.asReadonly()
  readonly id_moduloActual = this._idModuloActual.asReadonly()
  readonly moduloActual = this._moduloActual.asReadonly()
  readonly idSalaActual = this._idSalaActual.asReadonly()
  readonly salaActual = this._salaActual.asReadonly()
  readonly idRolActual = this._idRolActual.asReadonly()
}
