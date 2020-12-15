import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'artist-add',
  templateUrl: '../views/artist-add.html',
  providers : [ UserService, ArtistService ]
})

export class ArtistAddComponent implements OnInit {
	public title : string;
	public artist : Artist;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public isEdit : boolean;

	public constructor(private _route : ActivatedRoute, private _router : Router, private _userService : UserService, private _artistService : ArtistService) {
		this.title = 'Crear nuevo artista';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	  	this.artist = new Artist('','','');
	  	this.isEdit = false;
	}
	ngOnInit() {
	}

	public onSubmit() {
		console.log(this.artist);
		this._artistService.addArtist(this.token, this.artist).subscribe(
	  		response => {
	  			if (!response.artist) {
	  				this.errorMessage = 'Error al añadir artista';
	  			} else {
	  				//this.errorMessage = 'El artista se ha creado correctamente';
	  				//this.artist = response.artist;
	  				//this.artist = new Artist('','','');
	  				this._router.navigate(['/editar-artista', response.artist._id]);
	  			}
	  		}, error => {
	  			var errorMessage = <any>error;
	  			if (errorMessage != null) {
	  				console.log(error);
	  				this.errorMessage = error.error.message;
	  			}
	  		}
	  	);
	}

	fileChangeEvent(fileInput : any) {
		//this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}