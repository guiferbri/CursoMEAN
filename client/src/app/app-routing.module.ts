import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import { UserEditComponent } from './components/user-edit.component';

//import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//import home
import { HomeComponent } from './components/home.component';

//'' ruta por defecto
// ** ruta 'mala', cuando no hay ningun componente asociado
const routes: Routes = [
	{ path : '', component : HomeComponent},
	{ path : 'artistas/:page', component : ArtistListComponent},
	{ path : 'mis-datos', component : UserEditComponent},
	{ path : 'crear-artista', component : ArtistAddComponent},
	{ path : 'editar-artista/:id', component : ArtistEditComponent},
	{ path : 'artista/:id', component : ArtistDetailComponent},
	{ path : '**', component : HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
