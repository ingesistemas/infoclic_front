import {AfterViewInit, ChangeDetectorRef, Component, inject, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
import { EchoService } from '../../../../../servicios/echo.service';
import { Isalas } from '../../../../../interfaces/ISalas';

@Component({
  selector: 'app-llamado-salas',
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
  templateUrl: './llamado-salas.component.html',
  styleUrl: './llamado-salas.component.css',
   providers: [MessageService],
})
export class LlamadoSalasComponent {
  private fb = inject(FormBuilder)
  private peticionsServicios = inject(PeticionService)
  private autenticaServicio = inject(AutenticaService)
  private retornaErroresService = inject(RetornarErroresService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  private router = inject(Router)
  private zone = inject(NgZone);
  private echoServicio = inject(EchoService);
  private cdRef = inject(ChangeDetectorRef)
    
  constructor(private messageService: MessageService) {
    this.dataSource = new MatTableDataSource();
  }
  
  displayedColumns: string[] = ['opciones', 'paciente', 'fecha', 'hora_llegada', 'hora_asignacion', 'sala'];
  dataSource: MatTableDataSource<any>;
  llamados: any[] = []
  mensaje: string = ''
  mensajeToast: string = ''
  ahora: Date = new Date()
  timerSubscription!: Subscription
  turnoActual: any 
  mensajes: string[] = []
  salas!: Isalas[]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formulario = this.fb.group({
    id : [0],
    activo: [0],
    nombre: [''],
    sala: [''],
    piso: [''],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })

  async ngOnInit() {
    await setTimeout(() => {
      this.echoServicio.listenToLlamado((turno) => {
        this.zone.run(() => {
          this.mensajes.push(turno);
          this.cdRef.detectChanges(); // asegura que la vista se actualice
        });
      });
    },5000) 

    this.tamanioForm.actualizarCargando(false, CargandoComponent)
    this.peticion('/listar-turnos-salas')
    this.timerSubscription = interval(1000).subscribe(() => {
      this.ahora = new Date();
    });

    this.peticion('/obtener-salas-sucursal')
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  actualizarTurno(objeto: any){
    this.turnoActual = {
      id: objeto.id,
      id_paciente: objeto.paciente.id,
      nombre: objeto.paciente.nombre,
      documento: objeto.paciente.documento,
      sala: objeto.asignaciones[0].sala.sala,
      piso: objeto.asignaciones[0].sala.piso.piso,
      id_asigna: objeto.asignaciones[0].id,
      modulo: this.autenticaServicio.moduloActual()      
    }
    
    this.peticion('/disparar')
    this.tamanioForm.actualizar(false, null, 'Editar')
    this.router.navigate(['/turnity/turnity-general/crear-turno'], {
      state: { datos: this.turnoActual }
    });
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /* nuevo(){
    this.tamanioForm.actualizar(false, null, 'Crear')
    this.router.navigateByUrl('/turnity/configuracion-general/crear-centro')
  } */

  mostrarToast() {
    this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
  }

  /* editar(objeto: any){
    this.tamanioForm.actualizar(false, null, 'Editar')
    this.router.navigate(['//turnity/configuracion-general/crear-centro'], {
      state: { datos: objeto }
    });
  } */

  /* estado(objeto:any){
    this.formulario.controls['id'].setValue(objeto.id)
    this.formulario.controls['activo'].setValue(objeto.activo)
    this.peticion('/activo-centro')
  } */

  peticion(url:string){  
    let datos = null;
    if(url == '/disparar'){
      datos = this.turnoActual
    }else{
      datos = this.formulario.value
    }
    
   
    this.tamanioForm.actualizarCargando(true, CargandoComponent)
    this.peticionsServicios.peticionPOST(url, datos).subscribe({  
      next: (data) => {
        if(data.Status == 200){
          if(data.Error == true){
              if ((typeof data.Message === 'string')) {
                  this.mensaje = data.Message
              }else{
                Object.entries(data.Message).forEach(([campo, mensajes]) => {
                  const lista = Array.isArray(mensajes) ? mensajes : [mensajes];
                  lista.forEach(msg => {
                    this.mensaje += `- ${mensajes}\n`;
                  });
                });
              } 
            this.mensajeErrorServicios.actualizarError(this.mensaje, '')
            this.tamanioForm.actualizar( true, ErrorComponent)
          }else{
            
            if(data.Data.length == 0 && url != '/disparar'){
              this.mensaje = data.Message
              this.mensajeErrorServicios.actualizarError(this.mensaje, '')
              this.tamanioForm.actualizar( true, ErrorComponent)
              
            }else{      
              if(url == '/listar-turnos-salas'){
                let id_sala = this.autenticaServicio.idSalaActual()
                this.llamados = data.Data
                let respuesta = data.Data
                .map((s: any) => ({
                  ...s,
                  created_at: new Date(s.created_at),
                  asignaciones: s.asignaciones.filter((asig: any) => asig.id_sala === id_sala)
                }))
                .filter((s: any) => s.asignaciones.length > 0);
                this.dataSource.data = respuesta
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              if(url = '/obtener-salas-sucursal'){
                this.salas = data.Data
              }
            }
          }
        }else{
          this.mensaje = "Se presentó un error interno, posiblemente problemas de conexiones. Verifica el acceso a internet o comunícate con un asesor de Infoclic."
          this.mensajeErrorServicios.actualizarError(this.mensaje, '')
          this.tamanioForm.actualizar( true, ErrorComponent)
        }
      },
      error: (err) => {
        this.mensaje = "Error inesperado al obtener llamados.";
        this.mensajeErrorServicios.actualizarError(this.mensaje, '');
        this.tamanioForm.actualizar(false, ErrorComponent);
      },
      complete: () => {
        setTimeout(() => {
          this.zone.run(() => {
            this.tamanioForm.actualizarCargando(false, null);
          }, 2000);
        });
      }  
    })
  }

  consultar(id_sala: number){
    const filtrados = this.llamados.map(item =>({
      ...item,
      asignaciones: item.asignaciones.filter((asig:any) => asig.id_sala == id_sala )
    })).filter(item => item.asignaciones.length > 0)

    this.dataSource.data = filtrados
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}
