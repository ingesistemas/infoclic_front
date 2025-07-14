import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HortizontalTurnityComponent } from "../compartidos/hortizontal-turnity/hortizontal-turnity.component";
import { VerticalTurnityAdmin } from "../compartidos/vertical-turnity-admin/vertical-turnity-admin";

@Component({
  selector: 'app-inicio-turnity',
  imports: [RouterOutlet, HortizontalTurnityComponent, VerticalTurnityAdmin],
  templateUrl: './inicio-turnity.component.html',
  styleUrl: './inicio-turnity.component.css'
})
export class InicioTurnityComponent {
  ngOnInit(): void {
  history.pushState(null, '', location.href);
  window.onpopstate = () => {
   
  };
}
}
