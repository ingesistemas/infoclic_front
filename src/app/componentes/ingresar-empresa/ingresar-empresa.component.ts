import { Component, effect, inject, OnInit } from '@angular/core';
import { TamanioFormModalService } from '../../servicios/tamanio-form-modal.service';
import { FormBuilder, MaxValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticion.service';
import { ISucursales } from '../../interfaces/ISucursales';
import { ErrorComponent } from '../compartidos/mensajes/error/error.component';
import { MensajesService } from '../../servicios/mensajes.service';
import { SonidoErrorService } from '../../servicios/sonido-error.service';
import { RetornarErroresService } from '../../servicios/retornar-errores.service';
import { AutenticaService } from '../../servicios/autentica.service';
import { CargandoComponent } from '../compartidos/cargando/cargando.component';


@Component({
  selector: 'app-ingresar-empresa',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './ingresar-empresa.component.html',
  styleUrl: './ingresar-empresa.component.css'
})
export class IngresarEmpresaComponent implements OnInit {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private peticionsServicios = inject(PeticionService)
  private retornaErroresService = inject(RetornarErroresService)
  private autenticaServicio = inject(AutenticaService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  
  sucursales!: any
  mensaje: string = ""
  mostrarSucursales: boolean = false
  mostrarCargandoSucursales: boolean = false
  sonidoErrorServicio = inject(SonidoErrorService)
  idAplicacion = this.autenticaServicio.idAplicacionActual()
  aplicacion: string = ''
  aplicacionSelect = this.autenticaServicio.aplicacionSelect()
 

  formulario = this.fb.group({
    id : [0],
    usuario: ['sinfhos' , [Validators.required, Validators.minLength(5)]],
    password: ['123456' , [Validators.required, Validators.minLength(5)]],
    nit: ['900800800' , [Validators.required, Validators.minLength(5)]],
    id_sucursal: ['', [Validators.required]],
  })

  ngOnInit(): void {
    
  }

  cerrarModal(){
    this.tamanioForm.actualizar(false, null)
  }

  obternerSucursales(){
    this.peticion('/sucursalesUsuarios')
  }
  

  ingresar(){
    this.peticion('/login')
  }

  peticion(url:string){
    let nit = this.formulario.controls['nit'].value
    this.autenticaServicio.actualizarUsuarioActual('','','','','',nit!)
    if(url == '/sucursalesUsuarios'){
      this.mostrarCargandoSucursales = true
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
           
            if(data.Data.length == 0){
              this.mensaje = data.Message
              this.mensajeErrorServicios.actualizarError(this.mensaje, '')
              this.tamanioForm.actualizar( true, ErrorComponent)
              if(url == '/sucursalesUsuarios'){
                this.mostrarSucursales = false
              }
            }else{      
              
              if(url == '/sucursalesUsuarios'){
                this.mostrarSucursales = true
                this.sucursales = data.Data
              }
              
            }
            if(url == '/login'){
              this.autenticaServicio.actualizarAplicacionActual(this.idAplicacion, this.aplicacionSelect, '')
              this.tamanioForm.actualizarCargando(true, CargandoComponent)
              console.log(data.Data)
              console.log(data.token)
              console.log(data)
              
              const usuario = data.Data?.[0];
              console.log("id usuario: ", usuario.id)
              console.log("Nombre :", usuario.nombre)
              console.log("Email : ", usuario.email)
              let id_sucursal = this.formulario.controls['id_sucursal'].value

              this.tamanioForm.actualizar( false, null)
              
              //this.autenticaServicio.actualizarUsuarioActual()
              
                
              setTimeout(()=>{
                let nit = this.formulario.controls['nit'].value
                this.tamanioForm.actualizarCargando(false, null)
                this.autenticaServicio.actualizarUsuarioActual(usuario.id, usuario.nombre, usuario.email, id_sucursal!, data.token!, nit! )
                this.router.navigateByUrl('/turnity')
              },2000)
              
            }

          }
        }else{
          this.mensaje = "Se presentó un error interno, posiblemente problemas de conexiones. Verifica el acceso a internet o comunícate con un asesor de Infoclic."
          this.mensajeErrorServicios.actualizarError(this.mensaje, '')
          this.tamanioForm.actualizar( true, ErrorComponent)
        }
        if(url == '/sucursalesUsuarios'){
          this.mostrarCargandoSucursales = false
        }
      },
      
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
