import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Album } from '../models/album';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'album-list',
  templateUrl: '../views/album-list.html',
  providers : [ UserService, AlbumService ]
})

export class AlbumListComponent implements OnInit {
	public title : string;
	public albums? : Album[];
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public confirmado? : string | null;

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _albumService : AlbumService) {
		this.title = 'Albums';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	}
	ngOnInit() {
		this.getAlbums();
	}

	getAlbums() {
		this._albumService.getAlbums(this.token, null).subscribe(
			response => {
	  			if (!response) {
	  				this._router.navigate(['/']);
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

	onDeleteConfirm(id : string | undefined) {
		this.confirmado = id;
	}

	onCancelAlbum() {
		this.confirmado = null;
	}

	onDeleteAlbum(id : string | undefined) {
		if (id != null) {
			var albumId = id;
			this._albumService.deleteAlbum(this.token, albumId).subscribe(
				response => {
		  			if (!response.artist) {
		  				this.errorMessage = 'Ha ocurrido un error en el servidor';
		  			} else {
		  				this.getAlbums();
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