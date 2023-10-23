import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Escanear_Service } from '../Servicios/EscanearQR.service';
import { Datos_Locales } from '../Servicios/DatosLocales.service';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.css'],
})
export class CamaraComponent implements OnInit, OnChanges {
  public Camaras_Encontradas: MediaDeviceInfo[] = [];
  public Dispotivo_Usar: MediaDeviceInfo | any;

  public Escanear_Codigos_Off_ON = false;
  public Mostrar_Mensaje_Escaneo = false;
  public Habilitar_Camara_Off_ON = true;

  public Ultima_Matricula_Escaneada: string = ' ';
  public Ultimo_Nombre_Escaneado: string = '';
  public Ultimo_Estado_Escaneado: string = '';
  private Hora_Actual: any = '';

  constructor(
    private dataService: Escanear_Service,
    private datos_locales: Datos_Locales
  ) {}

  ngOnInit() {
    navigator.mediaDevices.enumerateDevices().then((dispositivos_buscar: MediaDeviceInfo[]) => {
        this.Camaras_Encontradas = dispositivos_buscar.filter(
          (dispositivo_encontrado: MediaDeviceInfo) => dispositivo_encontrado.kind === 'videoinput'
        );
        this.Dispotivo_Usar = this.Camaras_Encontradas[0];
        this.Escanear_Codigos_Off_ON = true;
      });

    this.datos_locales.Habilitar_Desabilitar_Camara_Observable().subscribe((habilitado: boolean) => {
        this.Habilitar_Camara_Off_ON = habilitado;
        if (this.Camaras_Encontradas.length > 0) {
          this.Dispotivo_Usar = this.Camaras_Encontradas[0];
          this.Escanear_Codigos_Off_ON = false;
        }
      });
  }

  Controlador_Camaras_Encontradas(camara_encontrada: MediaDeviceInfo[]) {
    this.Camaras_Encontradas = camara_encontrada;
    this.Escoger_Camara(this.Camaras_Encontradas[0].label);
  }

  Controlador_Escaneado(escaneado_recibido: string) {
    let obtener_Datos = escaneado_recibido.split(',');
    let fecha = new Date();

    this.Ultima_Matricula_Escaneada = obtener_Datos[0];
    this.Ultimo_Nombre_Escaneado = obtener_Datos[1];
    this.Ultimo_Estado_Escaneado = obtener_Datos[2];
    this.Hora_Actual = fecha.getHours() + ':' + fecha.getMinutes();

    this.dataService.almacenarDatosQR(
      this.Ultima_Matricula_Escaneada,
      this.Ultimo_Nombre_Escaneado,
      this.Ultimo_Estado_Escaneado,
      this.Hora_Actual
    );

    this.Mostrar_Mensaje_Escaneo = true;
    setTimeout(() => {
      this.Mostrar_Mensaje_Escaneo = false;
    }, 2000);
  }

  Escoger_Camara(etiquetas_camara: string) {
    this.Camaras_Encontradas.forEach((camaras_encontradas) => {
      if (camaras_encontradas.label.includes(etiquetas_camara)) {
        this.Dispotivo_Usar = camaras_encontradas;
        console.log(camaras_encontradas.label);
        this.Escanear_Codigos_Off_ON = true;
      }
    });
  }

  ngOnChanges(Habilitar_Desabilitar: SimpleChanges) {
    if (Habilitar_Desabilitar['estado_Camara'] && this.Camaras_Encontradas.length > 0) {
      this.Dispotivo_Usar = this.Camaras_Encontradas[0];
      this.Escanear_Codigos_Off_ON = Habilitar_Desabilitar['estado_Camara'].currentValue;
    }
  }
}
