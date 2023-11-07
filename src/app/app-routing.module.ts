import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamaraComponent } from './camara/camara.component';
import { ListasComponent } from './listas/listas.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { MostrarListasComponent } from './mostrar-listas/mostrar-listas.component';

const routes: Routes = [
  { path: '', redirectTo: 'Inicio', pathMatch: 'full' },
  { path: 'Inicio', component: ListasComponent },
  { path: 'Configuracion', component: ConfiguracionComponent },
  { path: 'Mostrar_lista', component: MostrarListasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
