import { inject, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { SonidoErrorService } from './sonido-error.service';

(window as any).Pusher = Pusher;
Pusher.logToConsole = true; // ✅ Logs para depurar

@Injectable({
  providedIn: 'root'
})
export class EchoService {
  private echo: Echo<any>;
  private sonidoServicio = inject(SonidoErrorService)

  constructor() {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: '556216ad0db5ca1b4925',  // 👈 Usa tu clave de Pusher real
      cluster: 'us2',              // 👈 Usa el cluster correcto
      forceTLS: true,
      encrypted: true
    });
  }

  /**
   * Escuchar el evento "llamadoPantalla" en el canal "turnity"
   * @param callback Función que recibe los datos emitidos por el evento
   */
  public listenToLlamado(callback: (turno: any) => void): void {
    
    this.echo.channel('turnity')
    .listen('.llamadoPantalla', (data: any) => {
      this.sonidoServicio.playSound('alert')
      callback(data); // Ejecuta el callback con los datos
    });
  }

  public listenToSegumiento(callback: (turno: any) => void): void {
    this.echo.channel('seguimiento')
    .listen('.seguimientoDiario', (data: any) => {
      callback(data); // Ejecuta el callback con los datos
    });
  }
}
