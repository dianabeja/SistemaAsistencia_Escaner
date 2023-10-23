import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamaraComponent } from './camara/camara.component';
import { ListasComponent } from './listas/listas.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

const routes: Routes = [
  { path: '', redirectTo: 'Inicio', pathMatch: 'full' },
  { path: 'Inicio', component: ListasComponent },
  { path: 'Configuracion', component: ConfiguracionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
