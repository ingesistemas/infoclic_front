import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SonidoErrorService {

  playSound(nombre: string = 'alert'): void {
    const audio = new Audio();
    audio.src = `../sonidos/${nombre}.mp3`;
    audio.load();
    audio.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }
}







 
