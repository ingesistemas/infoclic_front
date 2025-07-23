import { IPisos } from "./IPisos"

export interface Isalas{
  id: number,
  sala: string,
  id_piso: number,
  activo: number
  id_usuario: number,
  id_sucursal: number,
  piso?: IPisos

}