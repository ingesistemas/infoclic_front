import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { TamanioFormModalService } from '../../../servicios/tamanio-form-modal.service';

import { IngresarEmpresaComponent } from '../../ingresar-empresa/ingresar-empresa.component';
import { AutenticaService } from '../../../servicios/autentica.service';
import { ModalFormComponent } from '../modales/modal-form/modal-form.component';
import { CargandoComponent } from '../cargando/cargando.component';


@Component({
  selector: 'app-menu-horizontal-principal',
  imports: [],
  templateUrl: './menu-horizontal-principal.component.html',
  styleUrl: './menu-horizontal-principal.component.css'
})
export class MenuHorizontalPrincipalComponent {
  private autenticaServicio = inject(AutenticaService)
  isScrolled = false;
  modalForm = inject(TamanioFormModalService)

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Agrega la clase 'navbar-scrolled' si el scroll es > 50px
  }

  turnity(){
    this.modalForm.actualizar( true, IngresarEmpresaComponent)
  }

  cargando(){
    this.modalForm.actualizarCargando(true, CargandoComponent)
  }
}
