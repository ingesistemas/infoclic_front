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
  modulos: any = []
  id_sala = 0
  sala = ''

  formulario = this.fb.group({
    id : [0],
    usuario: ['sinfhos' , [Validators.required, Validators.minLength(5)]],
    password: ['1234567890' , [Validators.required, Validators.minLength(5)]],
    nit: ['900800800' , [Validators.required, Validators.minLength(5)]],
    id_sucursal: [0, [Validators.required]],
    id_modulo: [0, [Validators.required]],
  })

  ngOnInit(): void {
    if(!localStorage.getItem('ciudades')){
      this.obtenerCiudades()
    }
  }

  get moduloSeleccionadoTexto(): string | undefined {
    const idSeleccionado = this.formulario.get('id_modulo')?.value;
    const modulo = this.modulos.find((m: any) => m.id.toString() === idSeleccionado);
    console.log(modulo)
    this.id_sala = modulo?.id_sala
    this.sala = modulo?.sala.sala
    return modulo?.modulo;
    
  }

  cerrarModal(){
    this.tamanioForm.actualizar(false, null)
  }

  editarCredenciales(){
    this.tamanioForm.actualizar(false, null)
    this.router.navigate(['/turnity/configuracion-general/editar-credenciales'])
  }

  async obternerSucursales(){
    await this.peticion('/sucursalesUsuarios')
  }

  async obternerModulos(){
    await this.peticion('/obtener-modulos-sucursal')
  }

  async obtenerCiudades() {
    try {
      await this.peticion('/dptos');
      await this.peticion('/ciudades');
      await this.peticion('/obtener-pisos');
      await this.peticion('/obtener-prioritarias');
      await this.peticion('/obtener-casos')
      
    } catch (error) {
      console.error('Error en la cadena de peticiones:', error);
    }
  }
  
  ingresar(){
    if(this.formulario.controls['usuario'].value != 'no aplica' && this.formulario.controls['password'].value == 'admin' ){
      alert('Por seguridad, recuerda cambiar las credenciales de acceso, tales como usuario y contraseña. Para lo anterior, al momento de ingresar a la aplicación, haga clic en su nombre y después en cambiar credenciales.')
    }
    this.peticion('/login')
  }

  peticion(url:string){
    let nit = this.formulario.controls['nit'].value
    
    this.autenticaServicio.actualizarUsuarioActual('','','',0,'',nit!, '', 0, '', 0,'')
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
              
            }else{   
              if(url == '/sucursalesUsuarios'){
                this.mostrarSucursales = false
              }
              if(url == '/obtener-modulos-sucursal'){
                this.modulos = data.Data
                console.log(this.modulos)
              }   
              
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
              
              setTimeout(()=>{
                let nit = this.formulario.controls['nit'].value
                let id_modulo = this.formulario.controls['id_modulo'].value
                let modulo = this.moduloSeleccionadoTexto

                console.log("Sala actual " + this.sala)
                
                this.tamanioForm.actualizarCargando(false, null)
                this.autenticaServicio.actualizarUsuarioActual(usuario.id, usuario.nombre, usuario.email, id_sucursal!, data.token!, nit!, usuario.sucursales[0].sucursal, id_modulo!, modulo!, this.id_sala, this.sala )
                this.router.navigateByUrl('/turnity')
              },2000)
            }
            if(url == '/dptos'){
              localStorage.setItem('dptos', JSON.stringify(data.Data))
            }
            if(url == '/ciudades'){
              localStorage.setItem('ciudades', JSON.stringify(data.Data))
            }
            if(url == '/obtener-pisos'){
               localStorage.setItem('pisos', JSON.stringify(data.Data))
            }
            if(url == '/obtener-prioritarias'){
               localStorage.setItem('prioritarias', JSON.stringify(data.Data))
            }
            if(url == '/obtener-casos'){
              localStorage.setItem('casos', JSON.stringify(data.Data))
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
