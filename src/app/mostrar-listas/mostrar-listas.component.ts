import { Component, Inject, OnInit } from '@angular/core';
import { FirestoreService } from '../Servicios/FirestoreListas.service';
import { Datos_Locales } from '../Servicios/DatosLocales.service';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';


interface Estructura {
  Matricula: string;
  Nombre: string;
  Estado: string;
  Hora: string;
}

@Component({
  selector: 'app-mostrar-listas',
  templateUrl: './mostrar-listas.component.html',
  styleUrls: ['./mostrar-listas.component.css']
})
export class MostrarListasComponent implements OnInit {
  edificioSeleccionado: string = 'Selecciona un edificio';
  salonSeleccionado: string = 'Selecciona un salón';
  Lista_Asistencia: boolean = true;
  Materias_Cargadas: boolean = false;
  contrasena: string='';

  datosLeidos: Estructura[] = [];
  nrcMateria: string = '';
  carrera: string = '';

  Lista_Materias: any[] = [];
  listaAsistencia: any[] = [];

  constructor( @Inject(Datos_Locales) private datos_locales: Datos_Locales,
  private firestoreService: FirestoreService, private router: Router) {}

  async ngOnInit() {
    const edificio = this.datos_locales.obtener_DatoLocal('edificioSeleccionado');
    const salon = this.datos_locales.obtener_DatoLocal('salonSeleccionado');

    if (edificio && salon) {
      this.edificioSeleccionado = edificio;
      this.salonSeleccionado = salon;
    }

    const Obtener = this.datos_locales.obtener_DatoLocal('almacenarDatosQR');
    this.datosLeidos = Obtener ? JSON.parse(Obtener) : [];

    this.carrera = await this.firestoreService.getCarrera();
    this.nrcMateria = await this.firestoreService.getNrcByHorario();
    this.listaAsistencia = await this.firestoreService.getListaAsistencia(this.nrcMateria, this.carrera);
    this.Lista_Materias = await this.firestoreService.getMaterias();
  }

  GuardarDatosEnFirestore() {
    const db = firebase.firestore();

    let array: any = [
      [89012, "Principios de diseño de software", "07:00-09:00"],
      [12545, "Redes", "09:00-11:00"],
      [16234, "Administracion avanzada de servicios", "11:00-13:00"],
      [56789, "Administracion avanzada de servicios", "13:00-15:00"],
      [67390, "Proyectos de software", "15:00-17:00"],
      [95345, "Proyectos de software", "17:00-19:00"],
      [78601, "Programacion segura", "09:00-11:00"],
    ];

    for (let i = 0; i < array.length; i++) {
      const datos_lista: any = {
        nrc: array[i][0],
        nombre: array[i][1],
        horario: array[i][2],
      };

      // Crear una ruta dinámica que incluye la matrícula
      const rutaDocumento = db.collection(
        `edificio1/salon 11/lunes/`
      );

      // Darle un id al documento de lista de asistencia con el nombre de la matrícula
      const docRef = rutaDocumento.doc(datos_lista.horario);

      // Inicializar un lote de escritura para realizar múltiples operaciones en una transacción.
      const batch = db.batch();

      // Realizar una operación en el documento principal
      batch.set(docRef, {
        NRC: datos_lista.nrc,
        Nombre: datos_lista.nombre,
        Horario: datos_lista.horario,
      });

      // Realizar todas las operaciones en el lote de escritura
      batch.commit()
        .then(() => {
          console.log('Datos de lista de asistencia y subcolecciones creadas con éxito.');
        })
        .catch((error: any) => {
          console.error('Error al guardar los datos de lista de asistencia:', error);
        });
     }
  }
}
