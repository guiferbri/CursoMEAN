import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'song-add',
  templateUrl: '../views/song-add.html',
  providers : [ UserService, SongService ]
})

export class SongAddComponent implements OnInit {
	public titulo : string;
	public song : Song;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public isEdit : boolean;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _songService : SongService) {
		this.titulo = 'Añadir canción';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	  	this.song = new Song(0,'','','','');
	  	this.isEdit = false;
	}
	ngOnInit() {
	}

	public onSubmit() {
		console.log(this.song);
		this._route.params.forEach((params : Params) => {
			let albumId = params['albumId'];
			this.song.album = albumId;
			this._songService.addSong(this.token, this.song).subscribe(
		  		response => {
		  			if (!response.song) {
		  				this.errorMessage = 'Error al añadir la cancion';
		  			} else {
		  				//this.errorMessage = 'El artista se ha creado correctamente';
		  				//this.artist = response.artist;
		  				//this.artist = new Artist('','','');
		  				this._router.navigate(['/editar-cancion', response.song._id]);
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