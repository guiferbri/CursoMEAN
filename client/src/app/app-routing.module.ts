import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserEditComponent } from './components/user-edit.component';

//'' ruta por defecto
// ** ruta 'mala', cuando no hay ningun componente asociado
const routes: Routes = [
	{ path : '', component : UserEditComponent},
	{ path : 'mis-datos', component : UserEditComponent},
	{ path : '**', component : UserEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
