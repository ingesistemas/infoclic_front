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
    msg.lang = 'es-CO'; // Español
    msg.rate = 1;       // Velocidad de lectura (1 es normal)
    msg.volume = 1;
    speechSynthesis.speak(msg);
  }

  mensajellamado(mensaje:string){
    const msg = new SpeechSynthesisUtterance(`${mensaje}`);
    msg.lang = 'es-CO';
    msg.rate = 1;
    msg.volume = 1;

    const voces = speechSynthesis.getVoices();
    const voz = voces.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('google'));
    if (voz) msg.voice = voz;

    speechSynthesis.speak(msg);

  }

  obtenerMensajeError(){
    return this.mensajeError
  }
}
