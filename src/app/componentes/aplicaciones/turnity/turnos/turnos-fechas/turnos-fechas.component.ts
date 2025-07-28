import {AfterViewInit, ChangeDetectorRef, Component, inject, NgZone, OnInit, ViewChild, ViewEncapsulation, OnDestroy} from '@angular/core'; // Agregado OnDestroy
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
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


dayjs.extend(duration);

// --- Interfaz para la estructura de tus datos de Turno ---

@Component({
    selector: 'app-turnos-fechas',
    imports: [
        NgClass,
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
        ToastModule
    ],
    templateUrl: './turnos-fechas.component.html',
    styleUrl: './turnos-fechas.component.css',
    providers: [MessageService],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
            state('expanded', style({ height: '*', visibility: 'visible' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class TurnosFechasComponent implements OnInit, AfterViewInit, OnDestroy { // Implementamos OnDestroy

    private fb = inject(FormBuilder);
    private peticionsServicios = inject(PeticionService);
    private autenticaServicio = inject(AutenticaService);
    private retornaErroresService = inject(RetornarErroresService);
    private tamanioForm = inject(TamanioFormModalService);
    private mensajeErrorServicios = inject(MensajesService);
    private router = inject(Router);
    private zone = inject(NgZone);

    expandedElement: IConsultaTurnos | null = null;

    constructor(private messageService: MessageService) {
        this.dataSource = new MatTableDataSource<IConsultaTurnos>([]); // Inicializa con un array vacío
    }

    displayedColumns: string[] = ['opciones', 'paciente', 'prioridad', 'fecha', 'hora_llegada', 'hora_asignacion', 'hora_ini', 'hora_fin', 'sala', 'caso', 'asignado', 'creado'];
    dataSource: MatTableDataSource<IConsultaTurnos>;
    turnos: IConsultaTurnos[] = [];
    mensaje: string = '';
    mensajeToast: string = '';
    ahora: Date = new Date();
    timerSubscription!: Subscription;
    turnoActual: any;
    mostrarReporte: boolean = false

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    formulario = this.fb.group({
        id : [0],
        activo: [0],
        fecha_ini: [''],
        fecha_fin: [''],
        id_sucursal: [this.autenticaServicio.idSucursalActual()],
        id_usuario: [this.autenticaServicio.idUsuarioActual()]
    });

    ngOnInit(): void {
        /* this.tamanioForm.actualizarCargando(false, CargandoComponent);
        this.peticion('/listar-turnos-diarios');
        this.timerSubscription = interval(1000).subscribe(() => {
            this.ahora = new Date();
        }); */
    }

    ngAfterViewInit(): void {
        // Es importante que estas asignaciones se hagan después de que los ViewChilds estén disponibles.
        // Y MatTableDataSource debe estar inicializado con los datos si la petición es síncrona,
        // o si es asíncrona, asignar el paginador/sort DESPUÉS de recibir los datos.
        // Sin embargo, esta posición aquí es común y se debe a que el dataSource es una referencia.
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Configura el filterPredicate solo una vez, después de que dataSource esté listo.
        this.setupFilterPredicate(); // Llama aquí para que esté listo antes de cualquier filtro.
    }

    ngOnDestroy(): void {
        this.timerSubscription?.unsubscribe();
    }

    getTotalLlamados(asignaciones: any[]): number {
        if (!asignaciones) return 0;
        return asignaciones.reduce((acc, asignacion) => acc + (asignacion.llamados?.length || 0), 0);
    }

    calcularTranscurrido(horaLlegada: string): string {
        if (!horaLlegada) return '';

        const llegada = new Date(`1970-01-01T${horaLlegada}`);
        const ahora = new Date(this.ahora);
        const actual = new Date(`1970-01-01T${ahora.toTimeString().slice(0, 8)}`);

        const diff = actual.getTime() - llegada.getTime();

        if (diff < 0) return '00:00:00';

        const totalSeconds = Math.floor(diff / 1000);
        const horas = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutos = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const segundos = (totalSeconds % 60).toString().padStart(2, '0');

        return `${horas}:${minutos}:${segundos}`;
    }

    aceptar(){
        this.mostrarReporte = true
        this.tamanioForm.actualizarCargando(false, CargandoComponent);
        this.peticion('/listar-turnos-fechas');
       /*  this.timerSubscription = interval(1000).subscribe(() => {
            this.ahora = new Date();
        }); */
    }

    cerrar(){
        this.router.navigate(['/turnity'])
    }

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
        const horas = duracion.hours();
        const minutos = duracion.minutes();
        const segundos = duracion.seconds();

        let resultado = '';
        if (horas > 0) resultado += `${horas}h `;
        if (minutos > 0 || (horas === 0 && segundos === 0)) resultado += `${minutos}min `;
        if (segundos > 0 || resultado === '') resultado += `${segundos}s`;

        return resultado.trim();
    }

    // --- ¡Esta es la función clave para el filtro de datos anidados! ---
    setupFilterPredicate() {
        this.dataSource.filterPredicate = (data: IConsultaTurnos, filter: string): boolean => {
            const searchStr = (
                data.paciente.nombre +
                data.prioritaria.prioritaria +
                data.fecha +
                data.hora_llegada +
                // Recorrer las asignaciones para incluir sus datos en el filtro
                (data.asignaciones ? 
                    data.asignaciones.map(asig => 
                        (asig.hora_asigna || '') +
                        (asig.hora_ini || '') +
                        (asig.hora_fin || '') +
                        (asig.sala?.sala || '') +
                        (asig.sala?.piso?.piso || '') +
                        (asig.caso?.caso || '') +
                        (asig.operario?.nombre || '') +
                        (asig.usuarios?.nombre || '') +
                        (asig.modulo?.modulo || '') // <--- ¡Añadido el campo 'modulo' del módulo!
                    ).join(' ')
                    : ''
                )
            ).toLowerCase();
            
            return searchStr.indexOf(filter) !== -1;
        };
    }
    // -------------------------------------------------------------------

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    mostrarToast() {
        this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
    }

    atras(){
        this.turnos = []
        this.dataSource.data = []
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
                            if(url === '/listar-turnos-fechas'){
                                this.turnos = data.Data.map((s:any) => ({
                                    ...s,
                                    created_at: s.created_at ? new Date(s.created_at) : undefined
                                }));
                                this.dataSource.data = this.turnos;
                                // Asegúrate de que el paginador y el sort se aplican, aunque ya están en ngAfterViewInit
                                // Este seteo adicional no hace daño y asegura que si los datos llegan tarde, se actualicen.
                                this.dataSource.paginator = this.paginator;
                                this.dataSource.sort = this.sort;
                                console.log(this.turnos)
                                
                                // ¡Llama al setupFilterPredicate AQUÍ después de asignar los datos!
                                this.setupFilterPredicate(); 
                                
                                if (this.dataSource.paginator) {
                                    this.dataSource.paginator.firstPage();
                                }
                                console.log("Datos de turnos cargados y procesados:", this.turnos); // Debug
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

    retotnaError(campo:string){
        const control = this.formulario.get(campo)
        if (control && (control.touched || control.dirty) && control.invalid) {
            return this.retornaErroresService.getErrores(this.formulario, campo)
        }
        return null
    }

    
}