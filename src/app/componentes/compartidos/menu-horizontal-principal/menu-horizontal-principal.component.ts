import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { TamanioFormModalService } from '../../../servicios/tamanio-form-modal.service';

import { IngresarEmpresaComponent } from '../../ingresar-empresa/ingresar-empresa.component';

@Component({
  selector: 'app-menu-horizontal-principal',
  imports: [],
  templateUrl: './menu-horizontal-principal.component.html',
  styleUrl: './menu-horizontal-principal.component.css'
})
export class MenuHorizontalPrincipalComponent {
  isScrolled = false;
  modalForm = inject(TamanioFormModalService)

  constructor() {
    effect(() => {
      
    });  
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Agrega la clase 'navbar-scrolled' si el scroll es > 50px
  }

  turnity(){
    this.modalForm.actualizar( true, IngresarEmpresaComponent)
  }
}
