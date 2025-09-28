import { Component, inject, NgZone, HostListener  } from '@angular/core';
import { EchoService } from '../../../../../servicios/echo.service';
import { ChangeDetectorRef } from '@angular/core';
import { PeticionService } from '../../../../../servicios/peticion.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { HistorialLlamadoService } from '../../../../../servicios/historial-llamado.service';

@Component({
  selector: 'app-llamado-pantalla',
  templateUrl: './llamado-pantalla.component.html',
  styleUrl: './llamado-pantalla.component.css'
})
export class LlamadoPantallaComponent {
  private echoServicio = inject(EchoService);
  private zone = inject(NgZone);
  private peticionsServicios = inject(PeticionService);
  private cdRef = inject(ChangeDetectorRef)
  private mensajeServicio = inject(MensajesService)
  private historialLlamadoServicio = inject(HistorialLlamadoService)
  mensajeLlamado: string = '';
  nombre: string = ''
  sala: string = ''
  piso: string = ''
  modulo: string = ''

  async ngOnInit() {
    await this.echoServicio.listenToLlamado((turno) => {
      this.zone.run(() => {
        this.nombre = turno.nombre 
        this.sala = turno.sala
        this.piso = turno.piso
        this.modulo = turno.modulo
        this.mensajeLlamado = this.nombre + ',' + this.sala + ',' + this.piso + this.modulo  
        this.cdRef.detectChanges(); // asegura que la vista se actualice
      });
      this.mensajeServicio.mensajellamado(this.mensajeLlamado)
      this.historialLlamadoServicio.actualizarHistorialLlamado(turno)
    });
  }

  peticion(url: string) {
    this.peticionsServicios.peticionPOST(url, null).subscribe({
      next: (data) => {
        
      }
    });
  }

   // Escucha cuando el usuario intenta salir (cerrar o recargar)
  /* @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    $event.preventDefault();
    $event.returnValue = ''; 
  } */

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: BeforeUnloadEvent): void {
    // Simplemente llama a preventDefault() para activar la alerta nativa del navegador.
    $event.preventDefault(); 
  }
}

