import { inject, Injectable, signal } from '@angular/core';
import { SonidoErrorService } from './sonido-error.service';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  mensajeError = signal('')
  sonidoMensajeErrorServicios = inject(SonidoErrorService)

  actualizarError(mensaje: string, sonido: string){
    this.mensajeError.set(mensaje)
    /* if(sonido != ''){
      this.sonidoMensajeErrorServicios.playSound(sonido)
    } */
    const msg = new SpeechSynthesisUtterance(`${mensaje}`);
    msg.lang = 'es-ES'; // Español
    msg.rate = 1;       // Velocidad de lectura (1 es normal)
    msg.volume = 1;
    speechSynthesis.speak(msg);
  }

  obtenerMensajeError(){
    return this.mensajeError
  }
}
