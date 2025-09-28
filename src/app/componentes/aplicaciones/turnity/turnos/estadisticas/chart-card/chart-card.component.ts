// src/app/chart-card/chart-card.component.ts

import { CommonModule } from '@angular/common';
import { 
  Component, 
  Input, 
  OnChanges, 
  SimpleChanges, 
  ViewChild, 
  ElementRef, 
  AfterViewInit
} from '@angular/core';

import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  imports: [CommonModule],
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnChanges, AfterViewInit {
  @Input() title: string = '';
  @Input() iconClass: string = '';
  @Input() data: any[] = [];
  @Input() type: 'donut' | 'bar' | 'radialBar' = 'donut';
  showDropdown = false;

  @ViewChild('chartElement') chartElement!: ElementRef;

  private chart: ApexCharts | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      if (this.chart) {
        this.updateChart();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.data && this.data.length > 0) {
      this.renderChart();
    }
  }

  renderChart(): void {
    if (!this.chartElement || !this.data || this.data.length === 0) {
      console.warn('No se pudo renderizar el gráfico: Elemento DOM o datos no disponibles.', this.title);
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.data.map(item => item.nombre || item.operario_nombre);
    const series = this.data.map(item => item.cantidad || item.porcentaje);

    const options: any = {
      chart: {
        type: this.type,
        height: 350,
        toolbar: { show: false }
      },
      colors: this.getChartColors(this.data.length),
      dataLabels: { enabled: true },
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
    };

    if (this.type === 'bar') {
      options.series = [{ name: 'Turnos Atendidos', data: series }];
      options.plotOptions = {
        bar: {
          horizontal: true,
          distributed: true
        }
      };
      options.xaxis = {
        categories: labels
      };
    } else if (this.type === 'radialBar') {
      options.series = series;
      options.labels = labels;
      options.plotOptions = {
        radialBar: {
          dataLabels: {
            name: { fontSize: '22px' },
            value: { fontSize: '16px', formatter: (val: number) => val + '%' },
            total: { show: true, label: 'Total', formatter: () => '100%' }
          }
        }
      };
    } else { // 'donut'
      options.series = series;
      options.labels = labels;
      options.plotOptions = {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                label: 'Total',
                formatter: (w: any) => w.globals.series.reduce((a: any, b: any) => a + b, 0)
              }
            }
          }
        }
      };
    } // <-- ¡Llave de cierre agregada aquí!

    this.chart = new ApexCharts(this.chartElement.nativeElement, options);
    this.chart.render();
  }

  private updateChart(): void {
    if (this.chart) {
      const series = this.data.map(item => item.cantidad || item.porcentaje);
      this.chart.updateSeries(series);
    }
  }

  getChartColors(count: number): string[] {
    const palette = ['#3f51b5', '#00bcd4', '#ff9800', '#8bc34a', '#e91e63', '#9c27b0', '#ffc107', '#2196f3', '#795548'];
    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  }

  // -------------------------------------------------------------------------------------------------
  // Lógica de descarga y menú

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  async downloadChart(format: 'svg' | 'png' | 'jpg' | 'csv'): Promise<void> {
    this.showDropdown = false;

    if (!this.chart) {
      console.error('El objeto del gráfico no está inicializado.');
      return;
    }

    try {
      const data = await this.chart.dataURI();

      if ('imgURI' in data && data.imgURI) {
        const link = document.createElement('a');
        link.href = data.imgURI;
        link.download = `${this.title.replace(/\s/g, '_')}_grafico.${format}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.warn('El formato solicitado no es una imagen o la exportación falló.');
      }
    } catch (error) {
      console.error('Error al descargar el gráfico:', error);
    }
  }

}