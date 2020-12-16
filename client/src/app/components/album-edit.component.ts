import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Album } from '../models/album';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'album-edit',
  templateUrl: '../views/album-add.html',
  providers : [ UserService, AlbumService, UploadService ]
})

export class AlbumEditComponent implements OnInit {
	public titulo : string;
	public album : Album;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public isEdit : boolean;
	public filesToUpload? : Array<File>;
	public id : any;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _albumService : AlbumService, private _uploadService : UploadService) {
		this.titulo = 'Editar album';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	  	this.isEdit = true;
	  	this.album = new Album('','','','','');
	}
	ngOnInit() {
		this._route.params.forEach((params : Params) => {
			let id = params['id'];
			this.id = id;
			this.getAlbum(id);
		});
	}

	getAlbum(id : string) {
		this._albumService.getAlbum(this.token, id).subscribe(
			response => {
	  			if (!response) {
	  				this._router.navigate(['/']);
	  			} else {
	  				this.album = response;
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
		console.log(this.album);
		this._albumService.updateAlbum(this.token, this.id, this.album).subscribe(
	  		response => {
	  			if (!response.album) {
	  				this.errorMessage = 'Error en el servidor';
	  			} else {
	  				this.errorMessage = 'El album se ha actualizado correctamente';
	  				if (this.filesToUpload) {
  						//then porque devuelve una promesa
  						this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + this.id, [], this.filesToUpload, this.token, 'image').then((result : any) => {
  							//this.album.image = result.image;
	  						//let imagePath = this.url + 'get-image-album/' + this.album.image;
	  						//document.getElementById('imageLogged')!.setAttribute('src', imagePath);
	  						this._router.navigate(['/artista', response.album.artist]);
  						}, (error) => {
  							console.log(error);
  						});
  					} else {
  						this._router.navigate(['/artista', response.album.artist]);
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