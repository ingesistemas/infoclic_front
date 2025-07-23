import { IProfesiones } from "./IProfesiones";

export interface IOperarios{
  id: number,
  nombre: string,
  profesion: IProfesiones,
  celular: string,
  email: string,
  activo: number
}