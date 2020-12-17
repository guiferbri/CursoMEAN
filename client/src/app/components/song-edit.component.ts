import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers : [ UserService, SongService, UploadService ]
})

export class SongEditComponent implements OnInit {
	public titulo : string;
	public song : Song;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public isEdit : boolean;
	public filesToUpload? : Array<File>;
	public id : any;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _songService : SongService, private _uploadService : UploadService) {
		this.titulo = 'Editar canción';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	  	this.isEdit = true;
	  	this.song = new Song(0,'','','','');
	}
	ngOnInit() {
		this._route.params.forEach((params : Params) => {
			let id = params['id'];
			this.id = id;
			this.getSong(id);
		});
	}

	getSong(id : string) {
		this._songService.getSong(this.token, id).subscribe(
			response => {
	  			if (!response) {
	  				this._router.navigate(['/']);
	  			} else {
	  				this.song = response;
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
		console.log(this.song);
		this._songService.updateSong(this.token, this.id, this.song).subscribe(
	  		response => {
	  			if (!response.song) {
	  				this.errorMessage = 'Error en el servidor';
	  			} else {
	  				this.errorMessage = 'La canción se ha actualizado correctamente';
	  				if (this.filesToUpload) {
  						//then porque devuelve una promesa
  						this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + this.id, [], this.filesToUpload, this.token, 'file').then((result : any) => {
	  						this._router.navigate(['/album', response.song.album]);
  						}, (error) => {
  							console.log(error);
  						});
  					} else {
  						this._router.navigate(['/album', response.song.album]);
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