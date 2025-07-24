import { Component, inject, NgZone, HostListener  } from '@angular/core';
import { EchoService } from '../../../../../servicios/echo.service';
import { ChangeDetectorRef } from '@angular/core';
import { PeticionService } from '../../../../../servicios/peticion.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';

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
  mensajeLlamado: string = '';
  nombre: string = ''
  sala: string = ''
  piso: string = ''
  modulo: string = ''


  async ngOnInit() {

    await this.echoServicio.listenToLlamado((turno) => {
      this.zone.run(() => {
        console.log('🎯 Turno recibido en Angular:', turno);
        this.nombre = turno.nombre 
        this.sala = turno.sala
        this.piso = turno.piso
        this.modulo = turno.modulo
        this.mensajeLlamado = this.nombre + ',' + this.sala + ',' + this.piso + this.modulo  
        this.cdRef.detectChanges(); // asegura que la vista se actualice
      });
      this.mensajeServicio.mensajellamado(this.mensajeLlamado)

    });
  }

  peticion(url: string) {
    this.peticionsServicios.peticionPOST(url, null).subscribe({
      next: (data) => {
        console.log('✅ Respuesta del backend:', data);
      }
    });
  }

   // Escucha cuando el usuario intenta salir (cerrar o recargar)
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent) {
    $event.preventDefault();
    $event.returnValue = ''; // Necesario para mostrar el confirm
  }
}

