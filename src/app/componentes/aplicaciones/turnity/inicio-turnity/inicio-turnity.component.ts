import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HortizontalTurnityComponent } from "../compartidos/hortizontal-turnity/hortizontal-turnity.component";
import { VerticalTurnityAdmin } from "../compartidos/vertical-turnity-admin/vertical-turnity-admin";
import { TamanioFormModalService } from '../../../../servicios/tamanio-form-modal.service';
import { VerticalService } from '../../../../servicios/vertical.service';



@Component({
  selector: 'app-inicio-turnity',
  imports: [RouterOutlet, HortizontalTurnityComponent, VerticalTurnityAdmin],
  templateUrl: './inicio-turnity.component.html',
  styleUrl: './inicio-turnity.component.css'
})
export class InicioTurnityComponent implements AfterViewInit {
  
  
  private cdr = inject(ChangeDetectorRef)
  private tamanioForm = inject(TamanioFormModalService)
  mostrarVerticalServicio = inject(VerticalService)
  mostrarModalForm: boolean = false
  mostrarModalCargando: boolean = false
  ngOnInit(): void {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
   
    };
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges()
  }
}
