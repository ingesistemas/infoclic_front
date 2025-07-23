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

@Component({
  selector: 'app-crear-editar-sucursal',
  imports: [ ReactiveFormsModule, ToastModule],
  templateUrl: './crear-editar-sucursal.component.html',
  styleUrl: './crear-editar-sucursal.component.css',
  providers: [MessageService],
})
export class CrearEditarSucursalComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private peticionsServicios = inject(PeticionService)
  private retornaErroresService = inject(RetornarErroresService)
  private autenticaServicio = inject(AutenticaService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  private zone = inject(NgZone);
  
  sucursales!: any
  mensaje: string = ""
  mostrarSucursales: boolean = false
  mostrarCargandoSucursales: boolean = false
  sonidoErrorServicio = inject(SonidoErrorService)
  idAplicacion = this.autenticaServicio.idAplicacionActual()
  aplicacion: string = ''
  aplicacionSelect = this.autenticaServicio.aplicacionSelect()
  mensajeToast: string = ''
  ciudades!:ICiudades[]
  dptos!:IDptos[]
  accion = this.tamanioForm.accionActual()

  formulario = this.fb.group({
    id: [0],
    sucursal: ['' , [Validators.required, Validators.minLength(3)]],
    direccion: ['' , [Validators.required]],
    tels: [''],
    email: [''],
    id_ciudad: [0 , [Validators.required]],
    id_dep: [0],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })

  constructor(private messageService: MessageService){}
  ngOnInit(): void {
    const dptosString = localStorage.getItem('dptos')
    this.dptos = dptosString ? JSON.parse(dptosString) : [];
    if(this.tamanioForm.accionActual() == 'Editar'){
      
      const datos = history.state;
      this.formulario.controls['id'].setValue(datos.datos.id)
      this.formulario.controls['sucursal'].setValue(datos.datos.sucursal)
      this.formulario.controls['direccion'].setValue(datos.datos.direccion)
      this.formulario.controls['tels'].setValue(datos.datos.tels)
      this.formulario.controls['email'].setValue(datos.datos.email)
      this.formulario.controls['id_dep'].setValue(datos.datos.ciudad.id_dep)
      this.formulario.controls['id_ciudad'].setValue(datos.datos.ciudad.id)
      this.filtrtarCiudades()
    }
  }

  filtrtarCiudades(){
    const ciudadesLocal = localStorage.getItem('ciudades');
    let mCiudades: ICiudades[] = ciudadesLocal ? JSON.parse(ciudadesLocal) : [];
    const idDep = Number(this.formulario.controls['id_dep'].value);
    this.ciudades = mCiudades.filter(c => c.id_dep === idDep);
  }

  mostrarToast() {
    this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
  }

  cerrar(){
    this.router.navigateByUrl('/infoclic/configuracion-general/sucursales')
  }

  obtenerScursales(){
    this.peticion('/obtener-sucursales')
  }
    
  aceptar(){
    if(this.accion == 'Crear'){
      this.peticion('/crear-sucursal')
    }else{
      this.peticion('/editar-sucursal')
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
            this.mensaje = data.Message
            this.mostrarToast()
            setTimeout(()=>{
              this.cerrar()
            },2000)
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
