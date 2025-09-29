import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { AutenticaService } from '../../../../../servicios/autentica.service';
import { TamanioFormModalService } from '../../../../../servicios/tamanio-form-modal.service';
import { IngresarEmpresaComponent } from '../../../../ingresar-empresa/ingresar-empresa.component';
import { Router, RouterLink } from '@angular/router';
import { VerticalService } from '../../../../../servicios/vertical.service';

@Component({
  selector: 'app-hortizontal-turnity',
  imports: [ RouterLink],
  templateUrl: './hortizontal-turnity.component.html',
  styleUrl: './hortizontal-turnity.component.css'
})
export class HortizontalTurnityComponent {
  private autenticaServicio = inject(AutenticaService)
  private router = inject(Router)
   mostrarVerticalServicio = inject(VerticalService)
   idRolActual = this.autenticaServicio.idRolActual()
  //mostrarVerticalTurnity = this.mostrarVerticalServicio.mostrarVerticalTurnity()
  
  isScrolled = false;
  modalForm = inject(TamanioFormModalService)
  aplicacionActual = this.autenticaServicio.aplicacionActual
  nombreUsuarioActual = this.autenticaServicio.nombreUsuarioActual
  sucursalActual = this.autenticaServicio.sucursalActual
  modulo = this.autenticaServicio.moduloActual
  sala = this.autenticaServicio.salaActual
  

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Agrega la clase 'navbar-scrolled' si el scroll es > 50px
  }
  
  datosPersonales(){

  }
  
  cerrarSesion(){
    this.autenticaServicio.actualizarUsuarioActual('','','',0,'','','',0,'',0,'','')
    this.autenticaServicio.actualizarAplicacionActual('', '', '');
    localStorage.clear()
    this.router.navigate(['/']);
  }
  
  abrirVerical(){
    //this.mostrarVerticalServicio.actualizarVerticalTurnity(true)
  }

  
}
