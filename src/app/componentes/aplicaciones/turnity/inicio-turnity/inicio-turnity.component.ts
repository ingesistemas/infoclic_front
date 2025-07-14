import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HortizontalTurnityComponent } from "../compartidos/hortizontal-turnity/hortizontal-turnity.component";

@Component({
  selector: 'app-inicio-turnity',
  imports: [RouterOutlet, HortizontalTurnityComponent],
  templateUrl: './inicio-turnity.component.html',
  styleUrl: './inicio-turnity.component.css'
})
export class InicioTurnityComponent {

}
