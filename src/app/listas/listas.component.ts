import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../Servicios/FirestoreListas.service';
import { Datos_Locales } from '../Servicios/DatosLocales.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConexionService } from '../Servicios/Conexion.service';
import { interval, Subscription } from 'rxjs';

export interface Estructura {
  Matricula: string;
  Nombre: string;
  Estado: string;
  Hora: string;
}

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css'],
})
export class ListasComponent implements OnInit, OnDestroy {
  hora_Actual: number = new Date().getHours();

  subscription: Subscription | any;

  datosLeidos: Estructura[] = [];
  mostrarLista: Estructura[] = [];
  listaAsistencia: any[] = [];
  nrcMateria: string = '';
  carrera: string = '';
  datosCargados: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    @Inject(Datos_Locales) private datos_locales: Datos_Locales,
    private firestore: AngularFirestore,
    private conexionService: ConexionService
  ) {}

  async ngOnInit() {
    this.datos_locales
      .Lista_Datos_QR_Observable()
      .subscribe((nuevovalor: any) => {
        this.LlenarAsistencias(nuevovalor);
        this.datosLeidos = JSON.parse(nuevovalor) || [];
      });

    const Obtener = this.datos_locales.obtener_DatoLocal('almacenarDatosQR');
    this.datosLeidos = Obtener ? JSON.parse(Obtener) : [];
    this.cargarDatos().then(() => {
      this.datosCargados = true;
    });

    this.verificarCambioDeHora();
  }

  async cargarDatos() {
    this.carrera = await this.firestoreService.getCarrera();
    this.nrcMateria = await this.firestoreService.getNrcByHorario();
    this.listaAsistencia = await this.firestoreService.getListaAsistencia(
      this.nrcMateria,
      this.carrera
    );
  }

  aparece_en_Lista(alumno_recibido: [] | any): boolean {
    const buscar = this.listaAsistencia.find(
      (buscar_coincidencia) =>
        buscar_coincidencia.Matricula === alumno_recibido.Matricula
    );
    return !!buscar;
  }

  //CAMARA
  valor_Camara: boolean = true;

  onSubmit() {
    if (this.valor_Camara == false) {
      this.valor_Camara = true;
      this.datos_locales.Habilitar_Desabilitar_Camara_Observable().next(true);
    } else {
      this.valor_Camara = false;
      this.datos_locales.Habilitar_Desabilitar_Camara_Observable().next(false);
    }
  }

  verificarCambioDeHora() {
    this.subscription = interval(60000).subscribe(() => {
      console.log('Verificando cambio de hora');
      this.hora_Actual = new Date().getHours();
      let minutos_Actuales = new Date().getMinutes();

      if (this.hora_Actual % 2 != 0 && minutos_Actuales == 0) {
        this.LlenarInasistencias();
      }
    });
  }

  LlenarAsistencias(alumnosStr: string) {
    // Try to parse the string into a JavaScript array
    let alumnos;
    try {
      alumnos = JSON.parse(alumnosStr);
    } catch (error) {
      console.error('Error parsing alumnos string:', error);
      return; // Exit if there's an error in parsing
    }
    // Now, you should be able to filter the parsed array
    if (Array.isArray(alumnos)) {
      let arreglo: any = [];

      alumnos.map((alumnos: any) => {
        if (this.aparece_en_Lista(alumnos)) {
          arreglo.push(alumnos);
        }
      });

      let hora_Actual = new Date().getHours();
      let minutos_Actuales = new Date().getMinutes();
      let hora = hora_Actual + ':' + minutos_Actuales;

      let fecha_Actual = new Date().getDate();
      let mes_Actual = new Date().getMonth() + 1;
      let año_Actual = new Date().getFullYear();
      let fecha = fecha_Actual + '-' + mes_Actual + '-' + año_Actual;

      arreglo.map((alumno: any) =>
        this.conexionService.Asistencia(
          this.carrera,
          this.nrcMateria,
          alumno.Matricula,
          fecha,
          hora
        )
      );
    } else {
      console.error('alumnos is not an array even after parsing:', alumnos);
    }
  }

  LlenarInasistencias() {
    this.datosCargados = false;

    if (this.hora_Actual % 2 != 0) {
      this.cargarDatos().then(() => {
        this.datosCargados = true;
      });

      let hora_Actual = new Date().getHours();
      let minutos_Actuales = new Date().getMinutes();
      let hora = hora_Actual + ':' + minutos_Actuales;

      let fecha_Actual = new Date().getDate();
      let mes_Actual = new Date().getMonth() + 1;
      let año_Actual = new Date().getFullYear();
      let fecha = fecha_Actual + '-' + mes_Actual + '-' + año_Actual;

      this.listaAsistencia.map((alumno) =>
        this.conexionService.Inasistencia(
          this.carrera,
          this.nrcMateria,
          alumno.Matricula,
          fecha
        )
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}