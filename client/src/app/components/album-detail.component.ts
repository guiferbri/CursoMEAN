import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers : [ UserService, AlbumService, SongService ]
})

export class AlbumDetailComponent implements OnInit {
	public album : Album;
	public songs? : Song[];
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
	public id : string;
	public albums? : Album[];
  	public confirmado? : string | null;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _albumService : AlbumService, private _songService : SongService) {
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
		this.album = new Album('','','','','');
		this.id = '';
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

	  				//Sacar canciones
	  				this._songService.getSongs(this.token, id).subscribe(
	  					response => {
				  			if (!response) {
				  				this.errorMessage = 'Este album no tiene canciones';
				  			} else {
				  				this.songs = response;
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
	  		}, error => {
	  			var errorMessage = <any>error;
	  			if (errorMessage != null) {
	  				console.log(error);
	  				this.errorMessage = error.error.message;
	  			}
	  		}
	  	);
	}

	onDeleteConfirm(id : string | undefined) {
		this.confirmado = id;
	}

	onCancelSong() {
		this.confirmado = null;
	}

	onDeleteSong(idSong : string | undefined) {
		if (idSong != null) {
			var albumId = idSong;
			this._songService.deleteSong(this.token, idSong).subscribe(
				response => {
		  			if (!response.song) {
		  				this.errorMessage = 'Ha ocurrido un error en el servidor';
		  			} else {
		  				this.getAlbum(this.id);
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
	}

	startPlayer(song : Song) {
		let songPlayer = JSON.stringify(song);
		let filePath = this.url + 'get-file-song/' + song.file;
		let imageAlbumPath = this.url + 'get-image-album/' + song.album.image;
		let imageAlbumDefault = 'assets/default.jpg';

		localStorage.setItem('soundSong', songPlayer);
		document.getElementById('mp3Source')!.setAttribute('src', filePath);
		(document.getElementById('player') as any).load();
		(document.getElementById('player') as any).play();

		document.getElementById('currentSongInfo')!.innerHTML = song.name + ' - ' + song.album.artist.name;
		if (song.album.image && song.album.image != 'null') {
			document.getElementById('currentSongAlbum')!.setAttribute('src', imageAlbumPath);
		} else {
			document.getElementById('currentSongAlbum')!.setAttribute('src', imageAlbumDefault);
		}
	}
}