import { Component, inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PeticionService } from '../../../../../../servicios/peticion.service';
import { AutenticaService } from '../../../../../../servicios/autentica.service';
import { RetornarErroresService } from '../../../../../../servicios/retornar-errores.service';
import { TamanioFormModalService } from '../../../../../../servicios/tamanio-form-modal.service';
import { MensajesService } from '../../../../../../servicios/mensajes.service';
import { Router } from '@angular/router';
import { CargandoComponent } from '../../../../../compartidos/cargando/cargando.component';
import { ErrorComponent } from '../../../../../compartidos/mensajes/error/error.component';
import { ISucursales } from '../../../../../../interfaces/ISucursales';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-consultar',
  imports: [ToastModule, ReactiveFormsModule],
  templateUrl: './consultar.component.html',
  styleUrl: './consultar.component.css',
  providers: [MessageService],
})
export class ConsultarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private peticionsServicios = inject(PeticionService);
  private autenticaServicio = inject(AutenticaService);
  private retornaErroresService = inject(RetornarErroresService);
  private tamanioForm = inject(TamanioFormModalService);
  private mensajeErrorServicios = inject(MensajesService);
  private router = inject(Router);
  private zone = inject(NgZone);
  mensaje: string = ''
  mensajeToast: string = ''
  estadisticas: any = {};
  resumenGeneral: any = {};
  sucursales: ISucursales[] = []

  formulario = this.fb.group({
    fecha_ini: [''],
    fecha_fin: [''],
    id_sucursal: [''],
    id_usuario: [this.autenticaServicio.idUsuarioActual()],
    todas: [0],
  });
  constructor(private messageService: MessageService) {}
  
  ngOnInit(): void {
     this.peticion('/obtener-sucursales')
  }

  aceptar(){
    console.log(this.formulario)
    this.tamanioForm.actualizarCargando(false, CargandoComponent);
    this.peticion('/estadisticas-fechas');
  }

  cerrar(){
    this.router.navigate(['/turnity'])
  }

  mostrarToast() {
    this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
  }

  todas(){
    this.formulario.controls['id_sucursal'].setValue('')
  }

  sucursal(){
    this.formulario.controls['todas'].setValue(0)
  }

  retotnaError(campo:string){
    const control = this.formulario.get(campo)
    if (control && (control.touched || control.dirty) && control.invalid) {
        return this.retornaErroresService.getErrores(this.formulario, campo)
    }
    return null
  }

  atras(){
    //this.mostrarReporte = false
  }


  peticion(url:string){
    const datos = this.formulario.value
    this.tamanioForm.actualizarCargando(true, CargandoComponent);
    this.peticionsServicios.peticionPOST(url, datos).subscribe({
        next: (data) => {
            console.log(data)
            if(data.Status == 200){
                if(data.Error == true){
                    if ((typeof data.Message === 'string')) {
                        this.mensaje = data.Message;
                    } else {
                        this.mensaje = '';
                        Object.entries(data.Message).forEach(([campo, mensajes]) => {
                            const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
                            lista.forEach(msg => {
                                this.mensaje += `- ${msg}\n`;
                            });
                        });
                    }
                    this.mensajeErrorServicios.actualizarError(this.mensaje, '');
                    this.tamanioForm.actualizar( true, ErrorComponent);
                } else {
                    if(data.Data.length === 0 && url !== '/disparar'){
                        this.mensaje = data.Message;
                        this.mensajeErrorServicios.actualizarError(this.mensaje, '');
                        this.tamanioForm.actualizar( true, ErrorComponent);
                    } else {
                        if(url === '/estadisticas-fechas'){
                            //this.estadisticas = data;
                            //this.resumenGeneral = data;
                            this.router.navigate(['/turnity/turnity-general/infoEstadisticas'],
                              {
                                 state: { datos: data.Data }
                              }
                            )
                        }else if(url == '/obtener-sucursales'){
                            this.sucursales = data.Data
                        }
                    }
                }
            } else {
                this.mensaje = "Se presentó un error interno, posiblemente problemas de conexiones. Verifica el acceso a internet o comunícate con un asesor de Infoclic.";
                this.mensajeErrorServicios.actualizarError(this.mensaje, '');
                this.tamanioForm.actualizar( true, ErrorComponent);
            }
        },
        error: (err) => {
            this.mensaje = "Error inesperado al obtener llamados. " ;
            this.mensajeErrorServicios.actualizarError(this.mensaje, '');
            this.tamanioForm.actualizar(true, ErrorComponent);
        },
        complete: () => {
            setTimeout(() => {
                this.zone.run(() => {
                    this.tamanioForm.actualizarCargando(false, null);
                });
            }, 500);
        }
    });
} 
}
