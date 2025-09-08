import { Component, inject, NgZone, HostListener, OnInit, OnDestroy } from '@angular/core';
import { EchoService } from '../../../../../servicios/echo.service';
import { ChangeDetectorRef } from '@angular/core';
import { PeticionService } from '../../../../../servicios/peticion.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';

import { CommonModule, DatePipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Turno {
  nombre: string;
  sala: string;
  piso: string;
  modulo: string;
}

@Component({
  selector: 'app-llamado2-pantalla',
  templateUrl: './llamado-pantalla2.component.html',
  styleUrl: './llamado-pantalla2.component.css',
  imports: [CommonModule, DatePipe], // Si es standalone, estos imports son necesarios aquí
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('zoomInOut', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('*', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ]),
      transition('* => void', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class LlamadoPantalla2Component implements OnInit, OnDestroy {
  private echoServicio = inject(EchoService);
  private zone = inject(NgZone);
  private peticionsServicios = inject(PeticionService);
  // private cdRef = inject(ChangeDetectorRef); // Inyecta en el constructor si ya no es una clase standalone.
  private mensajeServicio = inject(MensajesService);

  horaActual: Date = new Date();
  turnoActual: Turno | null = null;
  showWelcomeMessage = true;
  private horaIntervalId: any;
  private turnoTimeout: any; // Temporizador para volver a la pantalla de bienvenida

  constructor(private cdRef: ChangeDetectorRef) { } // Inyecta ChangeDetectorRef en el constructor

  ngOnInit(): void {
    this.echoServicio.listenToLlamado((turno: Turno) => {
      this.zone.run(() => {
        console.log('🎯 Turno recibido en Angular:', turno);
        this.showTurno(turno);
        // this.cdRef.detectChanges(); // Ya se llama dentro de showTurno si es necesario
      });
    });

    this.horaIntervalId = setInterval(() => {
      this.horaActual = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.horaIntervalId) {
      clearInterval(this.horaIntervalId);
    }
    if (this.turnoTimeout) {
      clearTimeout(this.turnoTimeout);
    }
  }

  showTurno(turno: Turno): void {
    // Limpia cualquier temporizador de turno anterior para evitar solapamientos
    if (this.turnoTimeout) {
      clearTimeout(this.turnoTimeout);
    }

    // Paso 1: Oculta el mensaje de bienvenida. Esto activa la animación de salida de 'welcome-message'.
    this.showWelcomeMessage = false;
    // Pone turnoActual a null para activar la animación de salida del turno anterior, si lo hay.
    this.turnoActual = null; 
    this.cdRef.detectChanges(); // Fuerza la detección de cambios para ocultar el mensaje de bienvenida y/o turno anterior.
    
    // Paso 2: Después de un breve retraso (para permitir que las animaciones de salida jueguen),
    // asigna el nuevo turno. Esto activará la animación de entrada de 'turno-card'.
    setTimeout(() => {
      this.turnoActual = turno;
      this.cdRef.detectChanges(); // Fuerza la detección de cambios para mostrar el nuevo turno.
    }, 500); // 500ms es la duración de tu animación 'fadeInOut'

    const mensaje = `${turno.nombre}, ${turno.sala}, ${turno.piso}, ${turno.modulo}`;
    this.mensajeServicio.mensajellamado(mensaje);

    // Paso 3: Configura un temporizador para volver a la pantalla de bienvenida
    // después de que el turno actual haya sido visible por un tiempo.
    this.turnoTimeout = setTimeout(() => {
      this.mensajeServicio.mensajellamado(mensaje);
      this.showWelcome();
    }, 15000); // El turno se mostrará por 10 segundos.
  }

  showWelcome(): void {
    // Pone turnoActual a null para asegurar que la tarjeta del turno se oculte.
    this.turnoActual = null;
    this.cdRef.detectChanges(); // Fuerza la detección de cambios.

    setTimeout(() => {
      // Muestra el mensaje de bienvenida.
      this.showWelcomeMessage = true;
      this.cdRef.detectChanges(); // Fuerza la detección de cambios para mostrar el mensaje de bienvenida.
    }, 1500); // Espera a que la animación de salida del turno haya terminado.
  }

  peticion(url: string): void {
    this.peticionsServicios.peticionPOST(url, null).subscribe({
      next: (data) => {
        console.log('✅ Respuesta del backend:', data);
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    $event.preventDefault();
    $event.returnValue = '';
  }
}