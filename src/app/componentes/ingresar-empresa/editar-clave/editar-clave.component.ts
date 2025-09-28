import { ChangeDetectorRef, Component, effect, inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, MaxValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PeticionService } from '../../../servicios/peticion.service';
import { RetornarErroresService } from '../../../servicios/retornar-errores.service';
import { AutenticaService } from '../../../servicios/autentica.service';
import { TamanioFormModalService } from '../../../servicios/tamanio-form-modal.service';
import { MensajesService } from '../../../servicios/mensajes.service';
import { SonidoErrorService } from '../../../servicios/sonido-error.service';
import { CargandoComponent } from '../../compartidos/cargando/cargando.component';
import { ErrorComponent } from '../../compartidos/mensajes/error/error.component';

@Component({
  selector: 'app-editar-clave',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './editar-clave.component.html',
  styleUrl: './editar-clave.component.css',
  providers: [MessageService],
})
export class EditarClaveComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private peticionsServicios = inject(PeticionService)
  private retornaErroresService = inject(RetornarErroresService)
  private autenticaServicio = inject(AutenticaService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  private zone = inject(NgZone);
  
  mensaje: string = ""
  mostrarCampos: boolean = false
  sonidoErrorServicio = inject(SonidoErrorService)
  idAplicacion = this.autenticaServicio.idAplicacionActual()
  aplicacion: string = ''
  aplicacionSelect = this.autenticaServicio.aplicacionSelect()
  mensajeToast: string = ''
  accion = this.tamanioForm.accionActual()

  formulario = this.fb.group({
    id: [0],
    email: ['' , [Validators.required, Validators.minLength(3)]],
    usuario: ['' , [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(10)]],
    password2: ['', [Validators.required, Validators.minLength(10)]],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })

  constructor(private messageService: MessageService){}
  ngOnInit(): void {
    
    if(this.tamanioForm.accionActual() == 'Editar'){
      
      const datos = history.state;
      /* this.formulario.controls['id'].setValue(datos.datos.id)
      this.formulario.controls['email'].setValue(datos.datos.sucursal) */
     
    }
  }

  mostrarToast() {
    this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
  }

  cerrar(){
    this.router.navigateByUrl('/turnity')
  }

  validarEmail(){
    this.peticion('/obtener-email')
  }
    
  aceptar(){
    this.peticion('/editar-clave')
  }

  peticion(url:string){
    this.mensaje = ''
    this.tamanioForm.actualizarCargando(true, CargandoComponent)
    const datos = this.formulario.value;
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
            if(url == '/obtener-email'){

              if(data.Data.length > 0){
                this.mostrarCampos = true
              }
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
