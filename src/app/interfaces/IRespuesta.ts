export interface IRespuesta<T = any> {
  Data: T,
  Message: string,
  Error: boolean,
  Status: number,
  token?: string
}