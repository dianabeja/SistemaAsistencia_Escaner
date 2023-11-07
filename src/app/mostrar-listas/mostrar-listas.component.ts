import { Component, Inject, OnInit } from '@angular/core';
import { FirestoreService } from '../Servicios/FirestoreListas.service';
import { Datos_Locales } from '../Servicios/DatosLocales.service';
import { Router } from '@angular/router';
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
  Lista_Asistencia: boolean = false;
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
}
