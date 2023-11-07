import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamaraComponent } from './camara/camara.component';
import { ListasComponent } from './listas/listas.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MostrarListasComponent } from './mostrar-listas/mostrar-listas.component';
import { MostrarMateriasComponent } from './mostrar-materias/mostrar-materias.component';

const routes: Routes = [
  { path: '', redirectTo: 'Inicio', pathMatch: 'full' },
  { path: 'Inicio', component: ListasComponent },
  { path: 'Configuracion', component: ConfiguracionComponent },
  { path: 'Mostrar_lista', component: MostrarListasComponent },
  { path: 'Mostrar_materias', component: MostrarMateriasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
