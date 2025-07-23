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
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PeticionService } from '../../../../servicios/peticion.service';
import { AutenticaService } from '../../../../servicios/autentica.service';
import { RetornarErroresService } from '../../../../servicios/retornar-errores.service';
import { TamanioFormModalService } from '../../../../servicios/tamanio-form-modal.service';
import { MensajesService } from '../../../../servicios/mensajes.service';
import { CargandoComponent } from '../../../compartidos/cargando/cargando.component';
import { ErrorComponent } from '../../../compartidos/mensajes/error/error.component';

@Component({
  selector: 'app-obtener-salas',
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
    DatePipe,
    MatMenuModule,
    ToastModule
  ],
  templateUrl: './obtener-salas.component.html',
  styleUrl: './obtener-salas.component.css',
  providers: [MessageService],
})
export class ObtenerSalasComponent {
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
   
    displayedColumns: string[] = ['opciones', 'id', 'sala', 'piso', 'creado'];
    dataSource: MatTableDataSource<any>;
    salas: any[] = []
    mensaje: string = ''
    mensajeToast: string = ''
  
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
      this.peticion('/obtener-salas')
      //console.log(localStorage.getItem('ciudades'))
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
    nuevo(){
      this.tamanioForm.actualizar(false, null, 'Crear')
      this.router.navigateByUrl('/infoclic/configuracion-general/crear-sala')
    }
  
    mostrarToast() {
      this.messageService.add({ severity: 'success', summary: 'Turnity...', detail: this.mensaje });
    }
  
    editar(objeto: any){
      this.tamanioForm.actualizar(false, null, 'Editar')
      this.router.navigate(['/infoclic/configuracion-general/crear-sala'], {
        state: { datos: objeto }
      });
    }
  
    estado(objeto:any){
      this.formulario.controls['id'].setValue(objeto.id)
      this.formulario.controls['activo'].setValue(objeto.activo)
      this.peticion('/activo-sala')
    }
  
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
                if(url == '/obtener-salas'){
                  this.salas = data.Data.map((s:any) => ({
                    ...s,
                    created_at: new Date(s.created_at)
                  }));
                  this.dataSource.data = this.salas
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                  
                }else if(url == '/activo-sala'){
                  let id = this.formulario.controls['id'].value;
                  let activo = Number(this.formulario.controls['activo'].value);
                  this.mensaje = data.Message
                  // Aseguramos que this.sucursales es un array (solo si por error fue reasignado a objeto)
                  if (!Array.isArray(this.salas)) {
                    this.salas = Object.values(this.salas);
                  }
  
                  const index = this.salas.findIndex(s => s.id == id);
                  if (index !== -1) {
                    this.salas[index].activo = activo === 1 ? 0 : 1;
  
                    // Actualizar la tabla con nueva referencia
                    this.dataSource.data = [...this.salas];
                    this.mostrarToast()
                  }
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
          this.mensaje = "Error inesperado al obtener salas." + err;
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
