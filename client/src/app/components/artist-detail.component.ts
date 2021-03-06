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
  selector: 'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers : [ UserService, ArtistService, AlbumService ]
})

export class ArtistDetailComponent implements OnInit {
	public artist : Artist;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
	public id : string;
	public albums? : Album[];
  	public confirmado? : string | null;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _artistService : ArtistService, private _albumService : AlbumService) {
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
		this.artist = new Artist('','','','');
		this.id = '';
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

	  				this._albumService.getAlbums(this.token, id).subscribe(
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

	onCancelAlbum() {
		this.confirmado = null;
	}

	onDeleteAlbum(idAlbum : string | undefined) {
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
	}
}