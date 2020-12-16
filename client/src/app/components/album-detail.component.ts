import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers : [ UserService, AlbumService ]
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
		private _userService : UserService, private _albumService : AlbumService) {
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
	  				/*this._albumService.getAlbums(this.token, id).subscribe(
	  					response => {
				  			if (!response) {
				  				this.errorMessage = 'Este artista no tiene albums';
				  			} else {
				  				this.albums = response;
				  			}
				  		}, error => {
				  			var errorMessage = <any>error;
				  			if (errorMessage != null) {
				  				console.log(error);
				  				this.errorMessage = error.error.message;
				  			}
				  		}
				  	);*/
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

	/*onDeleteConfirm(id : string | undefined) {
		this.confirmado = id;
	}

	onCancelSong() {
		this.confirmado = null;
	}

	onDeleteSong(idAlbum : string | undefined) {
		if (idAlbum != null) {
			var albumId = idAlbum;
			this._albumService.deleteAlbum(this.token, albumId).subscribe(
				response => {
		  			if (!response.album) {
		  				this.errorMessage = 'Ha ocurrido un error en el servidor';
		  			} else {
		  				this.getArtist(this.id);
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
	}*/
}