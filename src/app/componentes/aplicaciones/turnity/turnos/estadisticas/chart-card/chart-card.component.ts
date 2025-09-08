// src/app/chart-card/chart-card.component.ts

import { 
  Component, 
  Input, 
  OnChanges, 
  SimpleChanges, 
  ViewChild, 
  ElementRef, 
  AfterViewInit // 👈 Importa este gancho
} from '@angular/core';

import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnChanges, AfterViewInit { // 👈 Implementa el gancho
  @Input() title: string = '';
  @Input() iconClass: string = '';
  @Input() data: any[] = [];
  @Input() type: 'donut' | 'bar' | 'radialBar' = 'donut';

  @ViewChild('chartElement') chartElement!: ElementRef;

  private chart: ApexCharts | undefined;

  // Usa ngOnChanges para detectar cambios en los datos, pero no para renderizar directamente
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      // Si el gráfico ya existe, solo actualízalo
      if (this.chart) {
        this.updateChart();
      }
    }
  }

  // ngAfterViewInit se ejecuta una vez que la vista del componente está lista
  ngAfterViewInit(): void {
    if (this.data && this.data.length > 0) {
      this.renderChart();
    }
  }

  renderChart(): void {
  // Verificaciones de seguridad para evitar errores
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
    // ... (opciones generales del gráfico)
    chart: {
      type: this.type,
      height: 350,
      toolbar: { show: false }
    },
    colors: this.getChartColors(this.data.length),
    dataLabels: { enabled: true },
    responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
  };

  // Lógica de configuración específica por tipo de gráfico
  if (this.type === 'bar') {
    // CRÍTICO: Formato correcto para el gráfico de barras
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
  }

  this.chart = new ApexCharts(this.chartElement.nativeElement, options);
  this.chart.render();
}
  
  // Nuevo método para actualizar el gráfico si los datos cambian
  private updateChart(): void {
    if (this.chart) {
      const series = this.data.map(item => item.cantidad || item.porcentaje);
      this.chart.updateSeries(series);
    }
  }

  // ... (el método getChartColors que ya tenías)
  getChartColors(count: number): string[] {
      const palette = ['#3f51b5', '#00bcd4', '#ff9800', '#8bc34a', '#e91e63', '#9c27b0', '#ffc107', '#2196f3', '#795548'];
      return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  }
}