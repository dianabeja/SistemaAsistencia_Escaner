import { Component, Inject, OnInit } from '@angular/core';
import { FirestoreService } from '../Servicios/FirestoreListas.service';
import { Datos_Locales } from '../Servicios/DatosLocales.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConexionService } from '../Servicios/Conexion.service';

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
export class ListasComponent implements OnInit {
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
      .subscribe((nuevoValor: any) => {
        this.datosLeidos = JSON.parse(nuevoValor) || [];
        if (this.conexionService.getOnlineStatus().getValue()) {
          this.conexionService.enviarDatos();
          this.datos_locales.eliminarDatosAlFinalizarDia();
        }
      });

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
  }

  aparece_en_Lista(alumno_recibido: Estructura): boolean {
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

  
}
