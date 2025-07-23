import { ChangeDetectorRef, Component, effect, inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, MaxValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../../../servicios/peticion.service';
import { RetornarErroresService } from '../../../../servicios/retornar-errores.service';
import { AutenticaService } from '../../../../servicios/autentica.service';
import { TamanioFormModalService } from '../../../../servicios/tamanio-form-modal.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { SonidoErrorService } from '../../../../servicios/sonido-error.service';
import { ErrorComponent } from '../../../compartidos/mensajes/error/error.component';
import { CargandoComponent } from '../../../compartidos/cargando/cargando.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ICiudades } from '../../../../interfaces/ICiudades';
import { IDptos } from '../../../../interfaces/IDptos';
import { Isalas } from '../../../../interfaces/ISalas';

@Component({
  selector: 'app-crear-editar-modulos',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './crear-editar-modulos.component.html',
  styleUrl: './crear-editar-modulos.component.css',
   providers: [MessageService],
})
export class CrearEditarModulosComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private peticionsServicios = inject(PeticionService)
  private retornaErroresService = inject(RetornarErroresService)
  private autenticaServicio = inject(AutenticaService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  private zone = inject(NgZone);
  
  modulos!: any
  mensaje: string = ""
  sonidoErrorServicio = inject(SonidoErrorService)
  idAplicacion = this.autenticaServicio.idAplicacionActual()
  aplicacion: string = ''
  aplicacionSelect = this.autenticaServicio.aplicacionSelect()
  mensajeToast: string = ''
  salas!: Isalas[]
  accion = this.tamanioForm.accionActual()

  formulario = this.fb.group({
    id: [0],
    modulo: ['' , [Validators.required, Validators.minLength(3)]],
    id_sala: [0 , [Validators.required]],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })

  constructor(private messageService: MessageService){}
  ngOnInit(): void {
    this.peticion('/obtener-salas')
    if(this.tamanioForm.accionActual() == 'Editar'){
      
      const datos = history.state;
      this.formulario.controls['id'].setValue(datos.datos.id)
      this.formulario.controls['modulo'].setValue(datos.datos.modulo)
      this.formulario.controls['id_sala'].setValue(datos.datos.id_sala)
    }
  }

  mostrarToast() {
    this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
  }

  cerrar(){
    this.router.navigateByUrl('/infoclic/configuracion-general/modulos')
  }

  aceptar(){
    if(this.accion == 'Crear'){
      this.peticion('/crear-modulo')
    }else{
      this.peticion('/editar-modulo')
    }
  }

  peticion(url:string){
    this.mensaje = ''
    this.tamanioForm.actualizarCargando(true, CargandoComponent)
    const datos = this.formulario.value;
    console.log(datos)
    this.peticionsServicios.peticionPOST(url, datos).subscribe({
      next: (data) => {
        if(data.Status == 200){
          if(data.Error == true){
              if ((typeof data.Message === 'string')) {
                  this.mensaje = data.Message
              }else{
                Object.entries(data.Message).forEach(([campo, mensajes]) => {
                  const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
                  lista.forEach(msg => {
                    this.mensaje += `- ${mensajes}\n`;
                  });
                });
              } 
            this.mensajeErrorServicios.actualizarError(this.mensaje, '')
            this.tamanioForm.actualizar( true, ErrorComponent)
            
          }else{
            if(url == '/obtener-salas'){
              this.salas = data.Data
              console.log(data.Data)
            }else{
              this.mensaje = data.Message
              this.mostrarToast()
              setTimeout(()=>{
                this.cerrar()
              },2000)
            }
          }
        }else{
          this.mensaje = "Se presentó un error interno, posiblemente problemas de conexiones. Verifica el acceso a internet o comunícate con un asesor de Infoclic."
          this.mensajeErrorServicios.actualizarError(this.mensaje, '')
          this.tamanioForm.actualizar( true, ErrorComponent)
        }
      },
      error: (err) => {
        this.mensaje = "Error inesperado al obtener sucursales.";
        this.mensajeErrorServicios.actualizarError(this.mensaje, '');
        this.tamanioForm.actualizar(false, ErrorComponent);
      },
      complete: () => {
        setTimeout(() => {
          this.zone.run(() => {
            this.tamanioForm.actualizarCargando(false, null);
          }, 2000);
        });
      }
    })
  }

  retotnaError(campo:string){
    const control = this.formulario.get(campo)
      if (control && (control.touched || control.dirty) && control.invalid) {
        return this.retornaErroresService.getErrores(this.formulario, campo)
      }
    return null
  }
}
