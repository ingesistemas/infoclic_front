import {AfterViewInit, ChangeDetectorRef, Component, inject, NgZone, OnInit, ViewChild, ViewEncapsulation, OnDestroy} from '@angular/core'; // Agregado OnDestroy
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PeticionService } from '../../../../../servicios/peticion.service';
import { AutenticaService } from '../../../../../servicios/autentica.service';
import { RetornarErroresService } from '../../../../../servicios/retornar-errores.service';
import { TamanioFormModalService } from '../../../../../servicios/tamanio-form-modal.service';
import { MensajesService } from '../../../../../servicios/mensajes.service';
import { CargandoComponent } from '../../../../compartidos/cargando/cargando.component';
import { ErrorComponent } from '../../../../compartidos/mensajes/error/error.component';
import { interval, Subscription } from 'rxjs';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IConsultaTurnos } from '../../../../../interfaces/IConsultaTurnos';
import { GraficosComponent } from '../graficos/graficos.component';
import { DatosGraficoService } from '../../../../../servicios/datos-grafico.service';
import { IDatoGrafico } from '../../../../../interfaces/IDatoGrafico';
import { GraficoTotalesComponentComponent } from '../grafico-totales-component/grafico-totales-component.component';
import { ISucursales } from '../../../../../interfaces/ISucursales';

@Component({
  selector: 'app-estadisticas-fechas',
  imports: [
    //NgClass,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatMenuModule,
    ToastModule,
    CommonModule
  ],
  templateUrl: './estadisticas-fechas.component.html',
  styleUrl: './estadisticas-fechas.component.css',
   providers: [MessageService],
})
export class EstadisticasFechasComponent implements OnInit {
    private fb = inject(FormBuilder);
    private peticionsServicios = inject(PeticionService);
    private autenticaServicio = inject(AutenticaService);
    private retornaErroresService = inject(RetornarErroresService);
    private tamanioForm = inject(TamanioFormModalService);
    private mensajeErrorServicios = inject(MensajesService);
    private router = inject(Router);
    private zone = inject(NgZone);
    private datosGraficoServicio = inject(DatosGraficoService)

    expandedElement: IConsultaTurnos | null = null;

    /*  datosGrafico = [
        { nombre: 'Nelson Fernando Silva Saavedra', cantidad: 1, porcentaje: 66.67, promedio: 0.67 },
        { nombre: 'Dylan Sneider Silva', cantidad: 1, porcentaje: 33.33, promedio: 0.33 }
    ]; */

    datosGrafico: IDatoGrafico[] = []
    mensaje: string = ''
    mensajeToast: string = ''
    mostrarReporte: boolean = false
    sucursales: ISucursales[] = []

    formulario = this.fb.group({
        fecha_ini: [''],
        fecha_fin: [''],
        id_sucursal: [''],
        id_usuario: [this.autenticaServicio.idUsuarioActual()],
        todas: [0],
    });

   
    resumenGeneral: any = {};
    estadisticas: any = {};

    secciones = [
        { key: 'por_prioritarias', label: 'Por Prioritarias', grafico:'Prioridades' },
        { key: 'por_operarios_atendieron', label: 'Por Operarios que Atendieron', grafico: 'Atendieron' },
        { key: 'por_usuarios_asignadores', label: 'Por Usuarios que Asignaron', grafico: 'Asignaron' },
        { key: 'por_salasenatencion', label: 'Por Salas en Atención', grafico: 'Salas' },
        { key: 'por_modulosenatencion', label: 'Por Módulos en Atención', grafico: 'Módulos' },
        { key: 'por_estado_caso', label: 'Por Estado del Caso', grafico: 'Casos' },
        { key: 'por_profesiones', label: 'Estadísticas por Profesiones', grafico: 'Profesiones' },
    ];

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        this.peticion('/obtener-sucursales')
    }

    aceptar(){
        this.mostrarReporte = true
        this.tamanioForm.actualizarCargando(false, CargandoComponent);
        this.peticion('/estadisticas-fechas');
    }

    cerrar(){
        this.router.navigate(['/turnity'])
    }

    /* calcularDuracion(inicio: string, fin: string): string {
        const hIni = dayjs(`2000-01-01T${inicio}`);
        const hFin = dayjs(`2000-01-01T${fin}`);

        if (!hIni.isValid() || !hFin.isValid()) return '';

        let diffMs = hFin.diff(hIni);

        if (diffMs < 0) {
            diffMs = dayjs(`2000-01-02T${fin}`).diff(hIni);
        }

        if (diffMs <= 0) return '0 min';

        const duracion = dayjs.duration(diffMs);
        const horas = duracion.hours();
        const minutos = duracion.minutes();
        const segundos = duracion.seconds();

        let resultado = '';
        if (horas > 0) resultado += `${horas}h `;
        if (minutos > 0 || (horas === 0 && segundos === 0)) resultado += `${minutos}min `;
        if (segundos > 0 || resultado === '') resultado += `${segundos}s`;

        return resultado.trim();
    } */
    calcularDuracion(inicio: string, fin: string): string {
        const hIni = dayjs(`2000-01-01T${inicio}`);
        const hFin = dayjs(`2000-01-01T${fin}`);

        if (!hIni.isValid() || !hFin.isValid()) return '';

        let diffMs = hFin.diff(hIni);

        if (diffMs < 0) {
            diffMs = dayjs(`2000-01-02T${fin}`).diff(hIni);
        }

        if (diffMs <= 0) return '0 min';

        const duracion = dayjs.duration(diffMs);

        // Usamos "as" para evitar el bug de minutos en 0
        const horas = Math.floor(duracion.asHours());
        const minutos = Math.floor(duracion.asMinutes() % 60);
        const segundos = Math.floor(duracion.asSeconds() % 60);

        let resultado = '';
        if (horas > 0) resultado += `${horas}h `;
        if (minutos > 0 || (horas === 0 && segundos === 0)) resultado += `${minutos}min `;
        if (segundos > 0 || resultado === '') resultado += `${segundos}s`;

        return resultado.trim();
    }


  // --- ¡Esta es la función clave para el filtro de datos anidados! ---
  

    mostrarToast() {
        this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
    }

    atras(){
        this.mostrarReporte = false
    }

    peticion(url:string){
        /* const datos = { // Construye el objeto de datos que tu API espera
            id_usuario: this.autenticaServicio.idUsuarioActual(),
            id_sucursal: this.autenticaServicio.idSucursalActual(),
            // Añade cualquier otro campo necesario que tu API espere, si no es solo con los IDs de usuario/sucursal.
            // Los campos del formulario.value no siempre son adecuados si la API espera solo los IDs.
            // Por ejemplo, si tu API esperaba solo id_usuario e id_sucursal:
            // id_usuario: this.formulario.value.id_usuario,
            // id_sucursal: this.formulario.value.id_sucursal
        }; */
        const datos = this.formulario.value
        this.tamanioForm.actualizarCargando(true, CargandoComponent);
        this.peticionsServicios.peticionPOST(url, datos).subscribe({
            next: (data) => {
                if(data.Status == 200){
                    if(data.Error == true){
                        if ((typeof data.Message === 'string')) {
                            this.mensaje = data.Message;
                        } else {
                            this.mensaje = '';
                            Object.entries(data.Message).forEach(([campo, mensajes]) => {
                                const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
                                lista.forEach(msg => {
                                    this.mensaje += `- ${msg}\n`;
                                });
                            });
                        }
                        this.mensajeErrorServicios.actualizarError(this.mensaje, '');
                        this.tamanioForm.actualizar( true, ErrorComponent);
                    } else {
                        if(data.Data.length === 0 && url !== '/disparar'){
                            this.mensaje = data.Message;
                            this.mensajeErrorServicios.actualizarError(this.mensaje, '');
                            this.tamanioForm.actualizar( true, ErrorComponent);
                        } else {
                            if(url === '/estadisticas-fechas'){
                                this.estadisticas = data;
                                this.resumenGeneral = data;
                            }else if(url == '/obtener-sucursales'){
                                this.sucursales = data.Data
                            }
                        }
                    }
                } else {
                    this.mensaje = "Se presentó un error interno, posiblemente problemas de conexiones. Verifica el acceso a internet o comunícate con un asesor de Infoclic.";
                    this.mensajeErrorServicios.actualizarError(this.mensaje, '');
                    this.tamanioForm.actualizar( true, ErrorComponent);
                }
            },
            error: (err) => {
                this.mensaje = "Error inesperado al obtener llamados. " ;
                this.mensajeErrorServicios.actualizarError(this.mensaje, '');
                this.tamanioForm.actualizar(true, ErrorComponent);
            },
            complete: () => {
                setTimeout(() => {
                    this.zone.run(() => {
                        this.tamanioForm.actualizarCargando(false, null);
                    });
                }, 500);
            }
        });
    } 

    toggleExpand(row: IConsultaTurnos) {
      this.expandedElement = this.expandedElement === row ? null : row;
    }

    todas(){
        this.formulario.controls['id_sucursal'].setValue('')
    }

    sucursal(){
        this.formulario.controls['todas'].setValue(0)
    }

    retotnaError(campo:string){
        const control = this.formulario.get(campo)
        if (control && (control.touched || control.dirty) && control.invalid) {
            return this.retornaErroresService.getErrores(this.formulario, campo)
        }
        return null
    }

    grafico(titulo: string, datos: string, tipo: string){
        this.datosGrafico = this.resumenGeneral.Data[datos]
        this.datosGraficoServicio.actualizarDatosGrafico(this.datosGrafico, titulo, tipo)
        this.tamanioForm.actualizar(true, GraficosComponent, '')
    } 

    graficoTotal(titulo: string, datos: string, tipo: string){
        this.datosGrafico = this.resumenGeneral.Data[datos]
        this.datosGraficoServicio.actualizarDatosGrafico(this.datosGrafico, titulo, tipo)
        this.tamanioForm.actualizar(true, GraficoTotalesComponentComponent, '')
    } 
}
