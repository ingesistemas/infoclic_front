import { Component, effect, inject, OnInit } from '@angular/core';
import { TamanioFormModalService } from '../../servicios/tamanio-form-modal.service';
import { FormBuilder, MaxValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PeticionService } from '../../servicios/peticion.service';
import { ISucursales } from '../../interfaces/ISucursales';
import { ErrorComponent } from '../compartidos/mensajes/error/error.component';
import { MensajesService } from '../../servicios/mensajes.service';
import { CargandoComponent } from '../compartidos/cargando/cargando.component';
import { SonidoErrorService } from '../../servicios/sonido-error.service';
import { RetornarErroresService } from '../../servicios/retornar-errores.service';


@Component({
  selector: 'app-ingresar-empresa',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './ingresar-empresa.component.html',
  styleUrl: './ingresar-empresa.component.css'
})
export class IngresarEmpresaComponent implements OnInit {

  tamanioForm = inject(TamanioFormModalService)
  mensajeErrorServicios = inject(MensajesService)
  sucursales!: any
  mensaje: string = ""
  mostrarSucursales: boolean = false
  mostrarCargandoSucursales: boolean = false
  sonidoErrorServicio = inject(SonidoErrorService)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private peticionsServicios = inject(PeticionService)
  private retornaErroresService = inject(RetornarErroresService)

  formulario = this.fb.group({
    id : [0],
    usuario: ['' , [Validators.required, Validators.minLength(5)]],
    password: ['' , [Validators.required, Validators.minLength(5)]],
    nit: ['' , [Validators.required, Validators.minLength(5)]],
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
              }/* else if(url == '/login'){
                data.Data.forEach((item: any, index: number) => {
                  this.mensaje = "El usuario no se encuentra activo"
                  if(item.activo == 0){
                    alert('activo')
                  }
                });
              } */
              
            }
            //this.router.navigateByUrl("/obtener-clientes")
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
