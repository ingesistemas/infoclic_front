import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;
Pusher.logToConsole = true; // ✅ Logs para depurar

@Injectable({
  providedIn: 'root'
})
export class EchoService {
  private echo: Echo<any>;

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
        console.log('📡 Evento recibido en EchoService:', data);
        callback(data); // Ejecuta el callback con los datos
      });
  }
}
