import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule]
})
export class DataTableComponent implements OnInit {
  @Input() title: string = '';
  @Input() iconClass: string = '';
  @Input() data: any[] = [];
  @Input() headers: string[] = [];
  @Input() keys: string[] = [];

  constructor() { }

  ngOnInit(): void { }
}