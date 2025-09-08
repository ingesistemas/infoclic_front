import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType, ChartConfiguration, Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DatosGraficoService } from '../../../../../servicios/datos-grafico.service';
import { TamanioFormModalService } from '../../../../../servicios/tamanio-form-modal.service';

Chart.register(ChartDataLabels);


@Component({
  selector: 'app-grafico-totales-component',
  imports: [
    CommonModule,
    NgChartsModule
  ],
  templateUrl: './grafico-totales-component.component.html',
  styleUrl: './grafico-totales-component.component.css'
})
export class GraficoTotalesComponentComponent {
  private datosGraficoServicio = inject(DatosGraficoService);
  private tamanioForm = inject(TamanioFormModalService);
  public chartPlugins = [ChartDataLabels];
  
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
            const datos = this.datosGraficoServicio.datosGrafico();
            const dato = datos[index];
            const tiempoTotal = dato?.total_atencion_hms ?? 'N/A';
            const horasDecimales = dato?.total_atencion_horas ?? 'N/A';

            return `${label}:\nHoras decimales: ${horasDecimales}\nTiempo total: ${tiempoTotal}`;
          }
        },
        bodyFont: {
          size: 13
        },
        backgroundColor: 'rgba(2, 6, 80, 0.81)',
        titleColor: '#FFD700',
        bodyColor: '#FFFFFF',
        borderColor: '#000000ff',
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
        // Muestra el valor en HH:MM:SS
        formatter: (value, context) => {
          const datos = this.datosGraficoServicio.datosGrafico();
          const index = context.dataIndex;
          const tiempoTotal = datos[index]?.total_atencion_hms ?? value;

          // ✅ CORRECCIÓN: Calcular el porcentaje en la etiqueta de datos
          const totalHoras = datos.reduce((sum, item) => sum + (item.total_atencion_horas ?? 0), 0);
          const horasActuales = datos[index]?.total_atencion_horas ?? 0;
          const porcentaje = totalHoras > 0 ? ((horasActuales / totalHoras) * 100).toFixed(1) : '0.0';

          return `${tiempoTotal} (${porcentaje}%)`;
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
        title: {
            display: true,
            text: 'Horas (decimal)', // Título para el eje Y
            font: {
              size: 14,
              weight: 'bold'
            }
        },
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
        let labels: string[];
        let data: number[];
        
        if (datos[0].hasOwnProperty('nombre')) {
          labels = datos.map(d => d.nombre ?? '');
          data = datos.map(d => d.cantidad ?? 0);
        } else {
          labels = datos.map(d => d.operario_nombre ?? '');
          data = datos.map(d => d.total_atencion_horas ?? 0);
        }

        this.chartData = {
          labels: labels,
          datasets: [{
            label: 'Total de Horas de Atención',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgb(54, 162, 235)',
            hoverBackgroundColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1.5,
            barThickness: 30,
            borderRadius: 10
          }]
        };

        this.chartOptions!.plugins!.title!.text = this.datosGraficoServicio.tituloGrafico();
      }
    });
  }
}
