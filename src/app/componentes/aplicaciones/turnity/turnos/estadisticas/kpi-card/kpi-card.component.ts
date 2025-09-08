import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent implements OnInit {
  @Input() iconClass: string = '';
  @Input() value: any;
  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
    // La animación del valor se puede hacer aquí en Angular si es necesario
  }
}