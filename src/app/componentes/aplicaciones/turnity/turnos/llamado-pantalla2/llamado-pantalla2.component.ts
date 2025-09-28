import { Component, inject, NgZone, HostListener, OnInit, OnDestroy } from '@angular/core';
import { EchoService } from '../../../../../servicios/echo.service';
import { ChangeDetectorRef } from '@angular/core';
import { PeticionService } from '../../../../../servicios/peticion.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';

import { CommonModule, DatePipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HistorialLlamadoService } from '../../../../../servicios/historial-llamado.service';
import { Ihistorial } from '../../../../../interfaces/IHistorialLlamado';
import { AutenticaService } from '../../../../../servicios/autentica.service';
import { FormBuilder } from '@angular/forms';

interface Turno {
  nombre: string;
  sala: string;
  piso: string;
  modulo: string;
  id_sucursal: string;
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

  horaActual: Date = new Date()
  turnoActual: Turno | null = null
  showWelcomeMessage = true
  showWelcomeMessage2 = false
  pacientes: any = []
 
  private horaIntervalId: any;
  private turnoTimeout: any; // Temporizador para volver a la pantalla de bienvenida
  private historialLlamadoServicio = inject(HistorialLlamadoService)
  private autenticaServicio = inject(AutenticaService)
  private fb = inject(FormBuilder)
  historial: Ihistorial[] = this.historialLlamadoServicio.datosLlamados()

  formulario = this.fb.group({
    id : [0],
    activo: [0],
    nombre: [''],
    sala: [''],
    piso: [''],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })
  constructor(private cdRef: ChangeDetectorRef) { } // Inyecta ChangeDetectorRef en el constructor

  ngOnInit(): void {
    this.echoServicio.listenToLlamado((turno: Turno) => {
    let sucursal = this.autenticaServicio.idSucursalActual();
    let sucursalString = sucursal.toString();

      if(turno.id_sucursal == sucursalString ){
        this.zone.run(() => {
          this.showTurno(turno);
          this.historialLlamadoServicio.actualizarHistorialLlamado(turno)
          let turnoEncontrado = this.historial.find(historialTurno => historialTurno.nombre === turno.nombre &&
              historialTurno.sala === turno.sala &&  historialTurno.modulo === turno.modulo);

          if(!turnoEncontrado || turnoEncontrado == undefined){
            let longi = this.historial.length
            this.historial.unshift(
              {
                "nombre": turno.nombre,
                "modulo": turno.modulo,
                "piso" : turno.piso,
                "sala": turno.sala
              }
            )

            if (this.historial.length > 7) {
              this.historial.pop();
            }
          }
          
        });
      }
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
    this.showWelcomeMessage2 = false;
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
     this.historialLlamadoServicio.actualizarHistorialLlamado(turno)

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

    setTimeout(() => {
      // Muestra el mensaje de bienvenida.
      this.showWelcomeMessage2 = true;
      this.cdRef.detectChanges(); // Fuerza la detección de cambios para mostrar el mensaje de bienvenida.
    }, 1500);
  }

  peticion(url: string): void {
    let datos = this.formulario.value
    this.peticionsServicios.peticionPOST(url, datos).subscribe({
      next: (data) => {
        if(url == '/ultimos-pacientes'){
          this.historialLlamadoServicio.actualizarHistorialLlamado(data.Data)
        }
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
  // Simplemente llama a preventDefault() para activar la alerta nativa del navegador.
    $event.preventDefault(); 
  }
}