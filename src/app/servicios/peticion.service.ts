import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IRespuesta } from '../interfaces/IRespuesta';
import { AutenticaService } from './autentica.service';

@Injectable({
  providedIn: 'root'
})
export class PeticionService {
  private autenticaServicio = inject(AutenticaService)
  private apiUrl = 'http://127.0.0.1:8000/api'; // Ajusta a tu URL real
  //private apiUrl = 'https://nabuapi.atenea.ai/api/nabu'

  constructor(private http: HttpClient) {}

  // Método para obtener comandos
  peticionPOST(url: string, datos:any){
    let nitActual = this.autenticaServicio.nitActual()
    let idAplicacionActual = this.autenticaServicio.idAplicacionActual()

    const headers = new HttpHeaders({
        'X-Empresa-NIT': nitActual,
        'X-Aplicacion-ID': idAplicacionActual, 
      });
    return this.http.post<IRespuesta>(this.apiUrl + url, datos, { headers }).pipe(
      map(response => response), // asumimos que la API devuelve { status, data }
      catchError(error => {
        return throwError(() => new Error('No se pudieron cargar los datos.', error));
      })
    );
  }

 
  peticionGET(url: string): Observable<IRespuesta> {
    return this.http.get<IRespuesta>(this.apiUrl + url).pipe(
      map(response => response), // asumimos que la API devuelve { status, data }
      catchError(error => {
        return throwError(() => new Error('No se pudieron cargar los datos.', error));
      })
    )
  }

  peticionPOSTToken(url: string, datos:any){
    let jwtToken = this.autenticaServicio.tokenActual()
    if (!jwtToken) {
      console.error('Token JWT ausente');
      return throwError(() => new Error('No hay token de autenticación.'));
    }else{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${jwtToken}`
      });

      return this.http.post<IRespuesta>(this.apiUrl + url, datos, { headers }).pipe(
        map(response => response), // asumimos que la API devuelve { status, data }
        catchError(error => {
          return throwError(() => new Error('No se pudieron cargar los datos.', error));
        })
      );
    }
  }

  peticionGETToken(url: string){
    let jwtToken = this.autenticaServicio.tokenActual()
    if (!jwtToken) {
      console.error('Token JWT ausente');
      return throwError(() => new Error('No hay token de autenticación.'));
    }else{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${jwtToken}`
      });

      return this.http.get<IRespuesta>(this.apiUrl + url, { headers }).pipe(
        map(response => response), // asumimos que la API devuelve { status, data }
        catchError(error => {
          console.error('Error al obtener comandos:', error);
          return throwError(() => new Error('No se pudieron cargar los datos.', error));
        })
      );
    }
  }
}
