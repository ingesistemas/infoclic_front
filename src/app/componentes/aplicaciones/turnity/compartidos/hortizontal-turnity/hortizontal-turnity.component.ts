import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { AutenticaService } from '../../../../../servicios/autentica.service';
import { TamanioFormModalService } from '../../../../../servicios/tamanio-form-modal.service';
import { IngresarEmpresaComponent } from '../../../../ingresar-empresa/ingresar-empresa.component';
import { Router } from '@angular/router';
import { VerticalService } from '../../../../../servicios/vertical.service';

@Component({
  selector: 'app-hortizontal-turnity',
  imports: [],
  templateUrl: './hortizontal-turnity.component.html',
  styleUrl: './hortizontal-turnity.component.css'
})
export class HortizontalTurnityComponent {
  private autenticaServicio = inject(AutenticaService)
  private router = inject(Router)
   mostrarVerticalServicio = inject(VerticalService)
  //mostrarVerticalTurnity = this.mostrarVerticalServicio.mostrarVerticalTurnity()
  
  isScrolled = false;
  modalForm = inject(TamanioFormModalService)
  aplicacionActual = this.autenticaServicio.aplicacionActual
  nombreUsuarioActual = this.autenticaServicio.nombreUsuarioActual

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Agrega la clase 'navbar-scrolled' si el scroll es > 50px
  }
  
  cerrarSesion(){
    this.autenticaServicio.actualizarUsuarioActual('','','',0,'','')
    this.autenticaServicio.actualizarAplicacionActual('', '', '');
    localStorage.clear()
    this.router.navigate(['/']);
  }
  
  abrirVerical(){
    //this.mostrarVerticalServicio.actualizarVerticalTurnity(true)
  }

  
}
