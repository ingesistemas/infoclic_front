import { ChangeDetectorRef, Component, effect, inject, NgZone, OnInit } from '@angular/core';
import { FormBuilder, MaxValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PeticionService } from '../../../../../servicios/peticion.service';
import { RetornarErroresService } from '../../../../../servicios/retornar-errores.service';
import { AutenticaService } from '../../../../../servicios/autentica.service';
import { TamanioFormModalService } from '../../../../../servicios/tamanio-form-modal.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { SonidoErrorService } from '../../../../../servicios/sonido-error.service';
import { CargandoComponent } from '../../../../compartidos/cargando/cargando.component';
import { IProfesiones } from '../../../../../interfaces/IProfesiones';
import { ErrorComponent } from '../../../../compartidos/mensajes/error/error.component';
import { IOperarios } from '../../../../../interfaces/IOperarios';
import { IModulo } from '../../../../../interfaces/IModulo';
import { Isalas } from '../../../../../interfaces/ISalas';
import wordsToNumbers from 'words-to-numbers-es';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-asignar-turno-pantalla',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './asignar-turno-pantalla.component.html',
  styleUrl: './asignar-turno-pantalla.component.css',
  providers: [MessageService],
})
export class AsignarTurnoPantallaComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private peticionsServicios = inject(PeticionService)
  private retornaErroresService = inject(RetornarErroresService)
  private autenticaServicio = inject(AutenticaService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  private zone = inject(NgZone);
  
  clientes!: any
  mensaje: string = ""
  sonidoErrorServicio = inject(SonidoErrorService)
  idAplicacion = this.autenticaServicio.idAplicacionActual()
  aplicacion: string = ''
  aplicacionSelect = this.autenticaServicio.aplicacionSelect()
  mensajeToast: string = ''
  profesiones!: IProfesiones[]
  operarios! : IOperarios[]
  accion = this.tamanioForm.accionActual()
  salas!: Isalas[]
  prioritarias!: any[]

  formulario = this.fb.group({
    id: [0],
    id_paciente:[0],
    nombre: ['' , [Validators.required, Validators.minLength(3)]],
    documento: ['' , [Validators.required, Validators.minLength(3)]],
    id_profesion: [0 , [Validators.required]],
    id_operario: [0 , [Validators.required]],
    id_prioritaria: [0 ],
    id_sala: [0 , [Validators.required]],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })

  constructor(private messageService: MessageService){}
  ngOnInit(): void {
    this.peticion('/obtener-profesiones')
    if(this.tamanioForm.accionActual() == 'Editar'){
      
      const datos = history.state;
      this.formulario.controls['id'].setValue(datos.datos.id)
      this.formulario.controls['id_paciente'].setValue(datos.datos.id_paciente)
      this.formulario.controls['nombre'].setValue(datos.datos.nombre)
      this.formulario.controls['documento'].setValue(datos.datos.documento)
    }
    if(!localStorage.getItem('prioritarias')){
        this.peticion('/obtener-prioritarias')
    }else{
      const prioritariasString = localStorage.getItem('prioritarias')
      this.prioritarias = prioritariasString ? JSON.parse(prioritariasString) : [];
    }
  }

  mostrarToast() {
    this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
  }

  obtenerCliente(){
    this.formulario.controls['nombre'].setValue('')
    this.formulario.controls['nombre'].enable();
    this.peticion('/obtener-cliente')
  }



  presionar(valor: string) {
    let nuevo = this.formulario.controls['documento'].value + valor
    this.formulario.controls['documento'].setValue(nuevo);
  }

  borrar() {
    this.formulario.controls['documento'].setValue(this.formulario.controls['documento'].value?.slice(0, -1) || '');
  }

  obtenerOperarios(){
    this.peticion('/obtener-usuario-profesion')
  }

  obtenerSalas(){
    this.peticion('/obtener-salas')
  }

  cerrar(){
    this.router.navigateByUrl('/turnity')
  }

  aceptar(){
      this.peticion('/crear-turno')
      const datos = this.formulario.value
      console.log(datos)
  }

  peticion(url:string){
    this.mensaje = ''
    if(url == '/crear-turno'){
      this.tamanioForm.actualizarCargando(true, CargandoComponent)
    }
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
            if(url == '/obtener-profesiones'){
              this.profesiones = data.Data
            }else if(url == '/obtener-usuario-profesion'){
              this.operarios = data.Data
            }else if(url == '/obtener-salas'){
              this.salas = data.Data
            }else if(url == '/obtener-prioritarias'){
              this.prioritarias = data.Data
            }else if(url == '/obtener-cliente'){
              if(data.Data[0].nombre != ''){
                this.formulario.controls['id_paciente'].setValue(data.Data[0].id)
                this.formulario.controls['nombre'].setValue(data.Data[0].nombre)
                this.formulario.controls['nombre'].disable();
              }else{
                this.formulario.controls['nombre'].enable();
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
        this.mensaje = "Se presento un error inesperado. Comunícate con un asesor infoclic.";
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

  

  reconocerVoz() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log('Texto dictado:', transcript);

    let numeroDetectado = transcript.replace(/\D/g, '');

    if (!numeroDetectado || numeroDetectado.length < 3) {
      try {
        const convertido = wordsToNumbers(transcript);
        numeroDetectado = String(convertido).replace(/\D/g, '');
      } catch (error) {
        console.warn('Error al convertir texto a número:', error);
        numeroDetectado = '';
      }
    }

    if (numeroDetectado.length >= 3) {
      this.formulario.controls['documento'].setValue(numeroDetectado);
      this.obtenerCliente();
    } else {
      alert('No se pudo reconocer un número válido. Intenta dictarlo nuevamente.');
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Error en reconocimiento de voz:', event.error);
    alert('Hubo un problema al reconocer la voz. Intenta de nuevo.');
  };
}

  retotnaError(campo:string){
    const control = this.formulario.get(campo)
      if (control && (control.touched || control.dirty) && control.invalid) {
        return this.retornaErroresService.getErrores(this.formulario, campo)
      }
    return null
  }

  
}
