import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers : [ UserService, ArtistService, UploadService ]
})

export class ArtistEditComponent implements OnInit {
	public title : string;
	public artist : Artist;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public isEdit : boolean;
	public filesToUpload? : Array<File>;
	public id : any;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _artistService : ArtistService, private _uploadService : UploadService) {
		this.title = 'Editar artista';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	  	this.artist = new Artist('','','');
	  	this.isEdit = true;
	}
	ngOnInit() {
		this._route.params.forEach((params : Params) => {
			let id = params['id'];
			this.id = id;
			this.getArtist(id);
		});
	}

	getArtist(id : string) {
		this._artistService.getArtist(this.token, id).subscribe(
			response => {
	  			if (!response) {
	  				this._router.navigate(['/']);
	  			} else {
	  				this.artist = response;
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

	public onSubmit() {
		console.log(this.artist);
		this._artistService.updateArtist(this.token, this.id, this.artist).subscribe(
	  		response => {
	  			if (!response.artist) {
	  				this.errorMessage = 'Error en el servidor';
	  			} else {
	  				this.errorMessage = 'El artista se ha actualizado correctamente';
	  				if (this.filesToUpload) {
  						//then porque devuelve una promesa
  						this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + this.id, [], this.filesToUpload, this.token, 'image').then((result : any) => {
  							//this.artist.image = result.image;
	  						//let imagePath = this.url + 'get-image-artist/' + this.artist.image;
	  						//document.getElementById('imageLogged')!.setAttribute('src', imagePath);
	  						this._router.navigate(['/artistas',1]);
  						}, (error) => {
  							console.log(error);
  						});
  					}
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
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}