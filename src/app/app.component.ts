import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioInfoclicComponent } from "./inicio-infoclic/inicio-infoclic.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InicioInfoclicComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
