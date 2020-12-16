import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'album-add',
  templateUrl: '../views/album-add.html',
  providers : [ UserService, ArtistService, AlbumService ]
})

export class AlbumAddComponent implements OnInit {
	public titulo : string;
	public album : Album;
	public artist? : Artist;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public isEdit : boolean;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _artistService : ArtistService, private _albumService : AlbumService) {
		this.titulo = 'Crear nuevo album';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	  	this.album = new Album('','','','','');
	  	this.isEdit = false;
	}
	ngOnInit() {
	}

	public onSubmit() {
		console.log(this.album);
		this._route.params.forEach((params : Params) => {
			let artistId = params['artistId'];
			this.album.artist = artistId;
			this._albumService.addAlbum(this.token, this.album).subscribe(
		  		response => {
		  			if (!response.album) {
		  				this.errorMessage = 'Error al añadir el album';
		  			} else {
		  				//this.errorMessage = 'El artista se ha creado correctamente';
		  				//this.artist = response.artist;
		  				//this.artist = new Artist('','','');
		  				this._router.navigate(['/editar-album', response.album._id]);
		  			}
		  		}, error => {
		  			var errorMessage = <any>error;
		  			if (errorMessage != null) {
		  				console.log(error);
		  				this.errorMessage = error.error.message;
		  			}
		  		}
		  	);
		});		
	}

	fileChangeEvent(fileInput : any) {
		//this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}