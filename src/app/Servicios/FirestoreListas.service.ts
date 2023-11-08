import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Datos_Locales } from './DatosLocales.service';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  Edificio: string | any;
  Salon: string | any;
  Dia: string | any;
  Hora: string | any;

  constructor(
    private firestore: AngularFirestore,
    @Inject(Datos_Locales) private datos_locales: Datos_Locales
  ) {

    /* let fecha = new Date();

    let diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let diaSemana = diasSemana[fecha.getDay()];   console.log('Día de la semana:', diaSemana);

    let horaInicio: any = fecha.getHours();
    if (horaInicio % 2 == 0) {
      horaInicio = horaInicio - 1;
    }
    let hora_fin = (horaInicio + 2) + ':00' ;
    horaInicio = horaInicio + ':00';

    let horaCompleta = horaInicio + '-' + hora_fin; */

    this.Dia = 'lunes';
    this.Hora = '11:00-13:00';
    this.Edificio = datos_locales.obtener_DatoLocal('edificioSeleccionado');
    this.Salon = this.datos_locales.obtener_DatoLocal('salonSeleccionado');
  }

  async getCarrera() {
    const carrera = await this.firestore.collection('/' + this.Edificio + '/' + this.Salon + '/carrera').get().toPromise();
    if (carrera) {
      const data = carrera.docs.map((doc) => doc.data());
      const data_Carrera: string | any = data[0];
      console.log(data_Carrera.Carrera)
      return data_Carrera.Carrera;
    } else {
      console.log('No se puede obtener la información de Firestore');
      return [];
    }

  }

  async getNrcByHorario() {
   let url = this.Edificio + '/' + this.Salon + '/lunes/' + this.Hora;
   console.log('url', url);
 
   try {
     const nrc_obtenido = await this.firestore.doc(url).get().toPromise();
 
     if (nrc_obtenido && nrc_obtenido.exists) {
       const nrc = nrc_obtenido.get('NRC'); // Obtenemos el valor del campo 'NRC'
       if (nrc !== undefined) {
         console.log('NRC:', nrc);
         return nrc;
       } else {
         console.log('El documento no contiene un campo NRC válido.');
         return null;
       }
     } else {
       console.log('El documento no existe en Firestore.');
       return null;
     }
   } catch (error) {
     console.error('Error al obtener datos de Firestore:', error);
     return null;
   }
  }

  async getListaAsistencia(nrc: string, carrera: string) {

    let url = '/'+carrera+ '/Materias/' + nrc;
    const lista_encontrada = await this.firestore.collection(url).get().toPromise();

    if (lista_encontrada) {
      const datos_lista = lista_encontrada.docs.map((alumnos) => alumnos.data());
      console.log(datos_lista)
      return datos_lista;
    } else {
      console.log('No se pudo obtener la información de Firestore.');
      return [];
    }
  }

  async getMaterias() {
    let url = '/' + this.Edificio + '/' + this.Salon + '/' + this.Dia + '/' ;

    const materias_obtenidas = await this.firestore.collection(url).get().toPromise();

    if (materias_obtenidas) {
      const datos_recibidos = materias_obtenidas.docs.map((datos) => datos.data());
      console.log(datos_recibidos)

      const materias: string | any = datos_recibidos;

      materias.sort((a: any, b: any) => {
        if (a.Horario < b.Horario) {
          return -1;
        }
        if (a.Horario > b.Horario) {
          return 1;
        }
        return 0;
      });

      return materias;
    } else {
      console.log('No se pudo obtener la información de Firestore.');
      return [];
    }
  }


}
