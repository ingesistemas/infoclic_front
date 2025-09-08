import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType, ChartConfiguration, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TamanioFormModalService } from '../../../../../servicios/tamanio-form-modal.service';
import { DatosGraficoService } from '../../../../../servicios/datos-grafico.service';

Chart.register(ChartDataLabels); // ✅ Plugin para mostrar etiquetas encima de las barras

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule
  ],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent {
  private tamanioForm = inject(TamanioFormModalService);
  private datosGraficoServicio = inject(DatosGraficoService);
  
  chartData: ChartData<ChartType> = {
    labels: [],
    datasets: []
  };

  chartType: ChartType = this.datosGraficoServicio.tipoGrafico() as ChartType;

  chartOptions: ChartConfiguration<ChartType>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: this.datosGraficoServicio.tituloGrafico(),
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 30
        },
        align: 'center'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const index = context.dataIndex;
             const tipoGrafico = (context.chart.config as any).type; 
            let cantidad;

            if (['bar', 'line', 'scatter'].includes(tipoGrafico)) {
              cantidad = context.parsed.y;
            } else {
              cantidad = context.raw;
            }

            const datos = this.datosGraficoServicio.datosGrafico();
            const dato = datos[index];
            const porcentaje = dato?.porcentaje ?? 0;
            const promedio = dato?.promedio ?? 0;

            return `${label}:\nCantidad: ${cantidad}\nPorcentaje: ${porcentaje.toFixed(2)}%\nPromedio: ${promedio.toFixed(2)}`;
          }
        },
        bodyFont: {
          size: 13
        },
        backgroundColor: 'rgba(2, 6, 80, 0.81)',   // Fondo negro transparente
        titleColor: '#FFD700',                // Título dorado
        bodyColor: '#FFFFFF',                 // Texto blanco
        borderColor: '#000000ff',               // Borde dorado
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#333',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value, context) => {
          const datos = this.datosGraficoServicio.datosGrafico();
          const index = context.dataIndex;
          const porcentaje = datos[index]?.porcentaje ?? 0;
          return `${value} (${porcentaje.toFixed(1)}%)`;
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#555',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: '#e0e0e0'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#555',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: '#f0f0f0'
        }
      }
    }
  };

  constructor() {
    effect(() => {
      const datos = this.datosGraficoServicio.datosGrafico();
      if (datos && datos.length > 0) {
        this.chartData = {
          labels: datos.map(d => d.nombre),
          datasets: [{
            label: 'Cantidad',
            data: datos.map(d => d.cantidad ?? 0),
            backgroundColor: [
              'rgba(66, 165, 245, 0.8)',
              'rgba(102, 187, 106, 0.8)',
              'rgba(255, 167, 38, 0.8)',
              'rgba(239, 83, 80, 0.8)',
              'rgba(171, 71, 188, 0.8)'
            ],
            borderColor: [
              '#1E88E5',
              '#43A047',
              '#FB8C00',
              '#E53935',
              '#8E24AA'
            ],
            hoverBackgroundColor: [
              '#2196F3',
              '#4CAF50',
              '#FFA000',
              '#F44336',
              '#9C27B0'
            ],
            borderWidth: 1.5,
            barThickness: 30,
            borderRadius: 10
          }]
        };

        // Actualiza dinámicamente el título del gráfico
        this.chartOptions!.plugins!.title!.text = this.datosGraficoServicio.tituloGrafico();
      }
    });
  }
}
