import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import user
import { UserEditComponent } from './components/user-edit.component';

//import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//import album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

//Song
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

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
	{ path : 'crear-album/:artistId', component : AlbumAddComponent},
	{ path : 'editar-album/:id', component : AlbumEditComponent},
	{ path : 'album/:id', component : AlbumDetailComponent},
	{ path : 'crear-cancion/:albumId', component : SongAddComponent},
	{ path : 'editar-cancion/:id', component : SongEditComponent},
	{ path : '**', component : HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
