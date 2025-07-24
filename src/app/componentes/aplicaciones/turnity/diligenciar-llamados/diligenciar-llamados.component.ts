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
import { IOperarios } from '../../../../interfaces/IOperarios';
import { EchoService } from '../../../../servicios/echo.service';


@Component({
  selector: 'app-diligenciar-llamados',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './diligenciar-llamados.component.html',
  styleUrl: './diligenciar-llamados.component.css',
  providers: [MessageService],
})
export class DiligenciarLlamadosComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private peticionsServicios = inject(PeticionService)
  private retornaErroresService = inject(RetornarErroresService)
  private autenticaServicio = inject(AutenticaService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  private zone = inject(NgZone);
  private echoServicio = inject(EchoService);
  mensajes: string[] = [];
  private cdRef = inject(ChangeDetectorRef)
  
  mensaje: string = ""
  sonidoErrorServicio = inject(SonidoErrorService)
  idAplicacion = this.autenticaServicio.idAplicacionActual()
  aplicacion: string = ''
  aplicacionSelect = this.autenticaServicio.aplicacionSelect()
  mensajeToast: string = ''
  casos: any[] = []
  salas: any[] = []
  profesiones: any[] = []
  operarios! : IOperarios[]
  accion = this.tamanioForm.accionActual()

  formulario = this.fb.group({
    id: [0],
    nombre: [{value:'', disabled: true} , [Validators.required, Validators.minLength(3)]],
    hora_llegada: [{value:'',disabled: true} , [Validators.required]],
    hora_asigna: [{value:'', disabled: true} , [Validators.required]],
    prioritaria: [{value:'', disabled: true} , [Validators.required]],
    id_caso: [0 , [Validators.required]],
    id_sala: [0],
    id_profesion: [0],
    id_operario_asig: [0],
    id_operario: [0],
    id_asigna: [0],
    creado: [{value:'', disabled: true} , [Validators.required]],
    id_modulo: [this.autenticaServicio.id_moduloActual()],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })

  constructor(private messageService: MessageService){}
  async ngOnInit() {
  

    await this.peticion('/obtener-salas')
    await this.peticion('/obtener-profesiones')
  
    if(this.tamanioForm.accionActual() == 'Editar'){
      
      const datos = history.state;
      this.formulario.controls['id'].setValue(datos.datos.id)
      this.formulario.controls['nombre'].setValue(datos.datos.paciente.nombre)
      this.formulario.controls['hora_llegada'].setValue(datos.datos.hora_llegada)
      this.formulario.controls['hora_asigna'].setValue(datos.datos.asignaciones[0].hora_asigna)
      this.formulario.controls['prioritaria'].setValue(datos.datos.prioritaria.prioritaria)
      this.formulario.controls['id_operario_asig'].setValue(datos.datos.asignaciones[0].operario.id)
      this.formulario.controls['id_caso'].setValue(datos.datos.prioritaria.id_caso)
      this.formulario.controls['creado'].setValue(datos.datos.asignaciones[0].usuarios.nombre)
      this.formulario.controls['id_asigna'].setValue(datos.datos.asignaciones[0].id)
      this.formulario.controls['id_operario'].setValue(datos.datos.asignaciones[0].operario.id)
    }

    const casosString = localStorage.getItem('casos')
    this.casos = casosString ? JSON.parse(casosString) : [];

    await this.peticion('/llamado-operario')
    await this.peticion('/hora-inicial-turno')
    //await this.peticion('/disparar')

    /* setTimeout(() => {
      this.echoServicio.listenToLlamado((turno) => {
        this.zone.run(() => {
          this.mensajes.push(turno);
          this.cdRef.detectChanges(); // asegura que la vista se actualice
        });
      });
    },5000) */
    
  }

  mostrarToast() {
    this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
  }

  obtenerOperarios(){
    this.peticion('/obtener-usuario-profesion')
  }

  obtenerSalas(){
    this.peticion('/obtener-salas')
  }


  cerrar(){
    this.router.navigateByUrl('/turnity/turnity-general/llamado-operario')
  }

  aceptar(){
    //this.peticion('/editar-asignaciones')
    this.peticion('/actualizar-llamado')
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
            if(url == '/obtener-casos'){
              this.casos = data.Data
            }else if(url == '/obtener-profesiones'){
              this.profesiones = data.Data
            }else if(url == '/obtener-salas'){
              this.salas = data.Data
            }else if(url == '/obtener-usuario-profesion'){
                this.operarios = data.Data
            }else if(url == '/llamado-operario'){
              
            }else if(url == '/hora-inicial-turno'){

            }else if(url == '/disparar'){

            }
            else{

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
        this.mensaje = "Error inesperado al diligenciar el turno.";
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
