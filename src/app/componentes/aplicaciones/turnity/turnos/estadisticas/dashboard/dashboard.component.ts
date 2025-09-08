import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DashboardService } from '../../../../../../servicios/dashboard.service';
import { Observable, of } from 'rxjs';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { DataTableComponent } from '../data-table/data-table.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [KpiCardComponent, ChartCardComponent, DataTableComponent]
})
export class DashboardComponent implements OnInit {
  resumenGeneral: any;
  porPrioritarias!: any[];
  porProfesiones!: any[];
  porOperariosAtendieron!: any[];
  porEstadoCaso!: any[];
  promediosTiemposOperarios!: any[];
  promediosTiempoRecepcion!: any[];
  por_modulosenatencion!: any[]
  por_salasenatencion!: any[]
  por_usuarios_asignadores!: any[]
  totales_tiempos_operarios!: any[]
  
  fechaInicio = '01/09/2025';
  fechaFin = '30/09/2025';


  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  // **MÉTODO FALTANTE:** Define la propiedad 'fetchDataSimulation'
  

  ngOnInit(): void {
    const datos = history.state;
    console.log("EStO ES LA CONSULTA ", datos)
    this.dashboardService.updateDashboardData(datos);
    /* this.dashboardService.fetchDataSimulation().subscribe((data:any) => {
      console.log("EStO ME DEVUELVE EL SERVICIO ", data)
      this.resumenGeneral = data.resumen_general;
      this.porProfesiones = datos.datos.por_profesiones;
    }) */
     this.resumenGeneral = datos.datos.resumen_general;
      this.porProfesiones = datos.datos.por_profesiones;
      this.porPrioritarias = datos.datos.por_prioritarias;
      this.porOperariosAtendieron = datos.datos.por_operarios_atendieron;
      this.porEstadoCaso = datos.datos.por_estado_caso;
      this.promediosTiemposOperarios = datos.datos.promedios_tiempos_operarios;
      this.promediosTiempoRecepcion = datos.datos.promedios_tiempo_recepcion_asignacion_por_usuario;
      this.por_modulosenatencion = datos.datos.por_modulosenatencion;
      this.por_salasenatencion = datos.datos.por_salasenatencion;
      this.por_usuarios_asignadores = datos.datos.por_usuarios_asignadores
      this.totales_tiempos_operarios = datos.datos.totales_tiempos_operarios 
    //this.resumenGeneral = datos.resumen_general;
    
      //this.porPrioritarias = datos.por_prioritarias;
      /*this.porProfesiones = data.por_profesiones;
      this.porOperariosAtendieron = data.por_operarios_atendieron;
      this.porEstadoCaso = data.por_estado_caso;
      this.promediosTiemposOperarios = data.promedios_tiempos_operarios;
      this.promediosTiempoRecepcion = data.promedios_tiempo_recepcion_asignacion_por_usuario;
      this.por_modulosenatencion = data.por_modulosenatencion;
      this.por_salasenatencion = data.por_salasenatencion;
      this.por_usuarios_asignadores = data.por_usuarios_asignadores
      this.totales_tiempos_operarios = data.totales_tiempos_operarios */
    
    this.cdr.detectChanges();
      
    /* this.dashboardService.fetchDataSimulation().subscribe((data:any) => {
      this.resumenGeneral = data.resumen_general;
      this.porPrioritarias = data.por_prioritarias;
      this.porProfesiones = data.por_profesiones;
      this.porOperariosAtendieron = data.por_operarios_atendieron;
      this.porEstadoCaso = data.por_estado_caso;
      this.promediosTiemposOperarios = data.promedios_tiempos_operarios;
      this.promediosTiempoRecepcion = data.promedios_tiempo_recepcion_asignacion_por_usuario;
      this.por_modulosenatencion = data.por_modulosenatencion;
      this.por_salasenatencion = data.por_salasenatencion;
      this.por_usuarios_asignadores = data.por_usuarios_asignadores
      this.totales_tiempos_operarios = data.totales_tiempos_operarios
    }); */
  }

  downloadPDF(): void {
    const dashboardContainer = document.querySelector('.dashboard-container') as HTMLElement;
    if (!dashboardContainer) {
      return;
    }

    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) downloadBtn.style.display = 'none';

    const originalWidth = dashboardContainer.offsetWidth;
    const originalHeight = dashboardContainer.offsetHeight;

    html2canvas(dashboardContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      width: originalWidth,
      height: originalHeight,
      windowWidth: originalWidth,
      windowHeight: originalHeight,
      onclone: (clonedDoc) => {
        const clonedBody = clonedDoc.body;
        clonedBody.style.margin = '0';
        clonedBody.style.padding = '40px 20px';
        
        const clonedContainer = clonedDoc.querySelector('.dashboard-container') as HTMLElement;
        if (clonedContainer) {
          clonedContainer.style.marginLeft = 'auto';
          clonedContainer.style.marginRight = 'auto';
          clonedContainer.style.width = originalWidth + 'px';
        }
      }
    }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const margin = 10;
      const contentWidth = imgWidth - (margin * 2);
      const imgHeightScaled = (canvas.height * contentWidth) / canvas.width;
      let heightLeft = imgHeightScaled;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeightScaled);
      heightLeft -= (pageHeight - margin);

      while (heightLeft > 0) {
        position = - (imgHeightScaled - heightLeft - margin);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeightScaled);
        heightLeft -= (pageHeight - margin);
      }
      
      if (downloadBtn) downloadBtn.style.display = 'block';
      pdf.save('reporte_turnos.pdf');
    });
  }

  formatHMS(seconds: number): string {
    if (seconds === null || isNaN(seconds)) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map(v => v < 10 ? '0' + v : v)
      .filter((v, i) => v !== '00' || i > 0 || h > 0)
      .join(':');
  }

}