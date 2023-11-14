import { Injectable, Inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from './FirestoreListas.service';

export interface Estructura {
  Matricula: string;
  Nombre: string;
  Estado: string;
  Hora: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConexionService {
  private onlineOffline = new BehaviorSubject<boolean>(navigator.onLine);
  carrera = this.firestoreService.getCarrera();
  nrcMateria = this.firestoreService.getNrcByHorario();

  constructor(
    @Inject(AngularFirestore) private firestore: AngularFirestore,
    private firestoreService: FirestoreService
  ) {
    //no sirve
    window.addEventListener('online', () => {
      console.log('Conexión a internet establecida');
      this.enviarDatos();
      this.onlineOffline.next(true);
    });

    window.addEventListener('offline', () => {
      console.log('Conexión a internet perdida');
      this.onlineOffline.next(false);
    });
  }

  get isOnline() {
    return this.onlineOffline.asObservable();
  }

  async enviarDatos() {
    let fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let año = fecha.getFullYear();
    let fechaCompleta = año + ':' + mes + ':' + dia;

    const listaAsistencia: any = await this.firestoreService.getListaAsistencia(
      await this.nrcMateria,
      await this.carrera
    );
    const datosAEnviar = this.verificarDatos(listaAsistencia);
    const inasistencia = this.listaInasistencia(listaAsistencia);

    datosAEnviar.forEach(async (dato: any) => {
      const coleccion = this.firestore
        .collection(
          '/Registro/Asistencia/' +
            (await this.nrcMateria) +
            '/' +
            fechaCompleta +
            '/Alumnos'
        )
        .doc(dato.Matricula)
        .set(dato)
        .then(() => {
          console.log('Dato guardado correctamente en Firestore');
        })
        .catch((error) => {
          console.error('Error al guardar el dato en Firestore: ', error);
        });
    });
  }

  async Asistencia(
    carrera: string,
    nrc_materia: string,
    matricula_alumno: string,
    fecha: string,
    hora: string
  ) {
    console.log(carrera, nrc_materia, matricula_alumno, fecha, 'datos');

    this.firestore
      .collection(
        '/' +
          carrera +
          '/Materias/' +
          nrc_materia +
          '/' +
          matricula_alumno +
          '/Asistencia'
      )
      .doc(fecha)
      .set({ hora: hora })
      .then(() => console.log('dato'));

    this.firestore
      .collection(
        '/' +
          carrera +
          '/Materias/' +
          nrc_materia +
          '/' +
          matricula_alumno +
          '/Inasistencia'
      )
      .doc(fecha)
      .delete();
  }

  async Inasistencia(
    carrera: string,
    nrc_materia: string,
    matricula_alumno: string,
    fecha: string
  ) {
    const coleccion = this.firestore
      .collection(
        '/' +
          carrera +
          '/Materias/' +
          nrc_materia +
          '/' +
          matricula_alumno +
          '/Inasistencia'
      )
      .doc(fecha)
      .set({ fecha: fecha })
      .then(() => console.log('dato'));
  }

  verificarDatos(lista: Estructura[]): Estructura[] {
    const datosLeidos = JSON.parse(
      localStorage.getItem('almacenarDatosQR') || '[]'
    );

    return datosLeidos.filter((dato: { Matricula: string }) => {
      const buscar = lista.find(
        (alumno) => alumno.Matricula === dato.Matricula
      );
      return !!buscar;
    });
  }

  listaInasistencia(lista: Estructura[]): Estructura[] {
    const datosLeidos = JSON.parse(
      localStorage.getItem('almacenarDatosQR') || '[]'
    );

    return datosLeidos.filter((dato: { Matricula: string }) => {
      const buscar = lista.find(
        (alumno) => alumno.Matricula === dato.Matricula
      );
      return !buscar;
    });
  }

  getOnlineStatus(): BehaviorSubject<boolean> {
    return this.onlineOffline;
  }
}