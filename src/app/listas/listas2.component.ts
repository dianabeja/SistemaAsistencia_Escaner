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
  //Variables para detectar el cambio de hora

  hora_Actual: number = new Date().getHours();
  subscription: Subscription | any;

  datosLeidos: Estructura[] | any = [];
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
  ) { }

  async ngOnInit() {

    this.datos_locales.Lista_Datos_QR_Observable()
      .subscribe((nuevovalor: any) => {
        this.LlenarAsistencias(nuevovalor)
        //Si no se reciben valores, la variable se inicia como array vacío, en caso contrario, convierte los valores recibidos en JSON y los almacena
        this.datosLeidos = JSON.parse(nuevovalor) || []

      })

    const Obtener = this.datos_locales.obtener_DatoLocal('almacenarDatosQR');
    this.datosLeidos = Obtener ? JSON.parse(Obtener) : [];
    this.cargarDatos().then(() => {
      this.datosCargados = true;
    });

  }

  async cargarDatos() {
    this.carrera = await this.firestoreService.getCarrera();
    this.nrcMateria = await this.firestoreService.getNrcByHorario();
    this.listaAsistencia = await this.firestoreService.getListaAsistencia(
      this.nrcMateria,
      this.carrera
    );
    console.log('adwdawdaw')
    console.log(this.listaAsistencia)
  }

  aparece_en_Lista(alumno_recibido: [] | any): boolean {
    const buscar = this.listaAsistencia.find(
      (buscar_coincidencia) =>
        buscar_coincidencia.Matricula === alumno_recibido.Matricula
    );
    return !!buscar;
  }

  verificarCambioDeHora() {
    this.subscription = interval(60000).subscribe(() => {
      const nuevaHora = new Date().getHours();

      if (this.hora_Actual != nuevaHora) {
        this.hora_Actual = nuevaHora;

        this.LlenarInasistencias();
      }
    });
  }

LlenarAsistencias(alumnosStr: string) {
  console.log("buscaaa");
  console.log(alumnosStr);

  // Try to parse the string into a JavaScript array
  let alumnos;
  try {
      alumnos = JSON.parse(alumnosStr);
  } catch (error) {
      console.error('Error parsing alumnos string:', error);
      return;  // Exit if there's an error in parsing
  }

  // Now, you should be able to filter the parsed array
  if (Array.isArray(alumnos)) {
      const array = alumnos.filter((alumno: any) => 
          this.aparece_en_Lista(alumno)
      );
      console.log("array", array)

      array.forEach((alumnos: any) => console.log(alumnos));
      array.map((alumno: any) => this.conexionService.Asistencia(this.carrera, this.nrcMateria, alumno.Materia, '23-10-23'));
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

      this.carrera;
      this.nrcMateria;

      this.listaAsistencia.map((alumno) =>
        this.conexionService.Asistencia(
          this.carrera,
          '12341',
          alumno.Matricula,
          '23-10-23'
        )
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
