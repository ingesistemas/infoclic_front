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

@Component({
  selector: 'app-llamado-operario',
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
  templateUrl: './llamado-operario.component.html',
  styleUrl: './llamado-operario.component.css',
  providers: [MessageService],
})
export class LlamadoOperarioComponent {
  private fb = inject(FormBuilder)
  private peticionsServicios = inject(PeticionService)
  private autenticaServicio = inject(AutenticaService)
  private retornaErroresService = inject(RetornarErroresService)
  private tamanioForm = inject(TamanioFormModalService)
  private mensajeErrorServicios = inject(MensajesService)
  private router = inject(Router)
  private zone = inject(NgZone);
    
  constructor(private messageService: MessageService) {
    this.dataSource = new MatTableDataSource();
  }
  
  displayedColumns: string[] = ['opciones', 'paciente', 'prioridad', 'fecha', 'hora_llegada', 'hora_asignacion', 'sala', 'asignado', 'creado'];
  dataSource: MatTableDataSource<any>;
  llamados: any[] = []
  mensaje: string = ''
  mensajeToast: string = ''
  ahora: Date = new Date();
  timerSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formulario = this.fb.group({
    id : [0],
    activo: [0],
    id_sucursal: [this.autenticaServicio.idSucursalActual()],
    id_usuario: [this.autenticaServicio.idUsuarioActual()]
  })

  ngOnInit(): void {
    this.tamanioForm.actualizarCargando(false, CargandoComponent)
    this.peticion('/listar-turnos')
    this.timerSubscription = interval(1000).subscribe(() => {
      this.ahora = new Date();
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  actualizarTurno(objeto: any){
    this.tamanioForm.actualizar(false, null, 'Editar')
    this.router.navigate(['/turnity/turnity-general/diligenciar-llamados'], {
      state: { datos: objeto }
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
    const datos = this.formulario.value;
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
            
            if(data.Data.length == 0){
              this.mensaje = data.Message
              this.mensajeErrorServicios.actualizarError(this.mensaje, '')
              this.tamanioForm.actualizar( true, ErrorComponent)
              
            }else{      
              if(url == '/listar-turnos'){
                this.llamados = data.Data.map((s:any) => ({
                  ...s,
                  created_at: new Date(s.created_at)
                }));
                this.dataSource.data = this.llamados
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                
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
}
