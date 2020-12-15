import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'artist-list',
  templateUrl: '../views/artist-list.html',
  providers : [ UserService, ArtistService ]
})

export class ArtistListComponent implements OnInit {
	public title : string;
	public artists? : Artist[];
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
  	public nextPage : number;
  	public prePage : number;
  	public confirmado? : string | null;

	public constructor(private _route : ActivatedRoute, private _router : Router, private _userService : UserService, private _artistService : ArtistService) {
		this.title = 'Artistas';
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
	  	this.nextPage = 1;
	  	this.prePage = 1;
	}
	ngOnInit() {
		this.getArtists();
	}

	getArtists() {
		this._route.params.forEach((params : Params) => {
			let page = +params['page']; //Con el + se convierte a un numero
			if (!page) {
				page = 1;
			} else {
				this.nextPage = page+1;
				this.prePage = page-1;
				if (this.prePage == 0) {
					this.prePage = 1;
				}
			}

			this._artistService.getArtists(this.token, page).subscribe(
				response => {
		  			if (!response.artists) {
		  				this._router.navigate(['/']);
		  			} else {
		  				this.artists = response.artists;
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

	onDeleteConfirm(id : string | undefined) {
		this.confirmado = id;
	}

	onCancelArtist() {
		this.confirmado = null;
	}

	onDeleteArtist(id : string | undefined) {
		if (id != null) {
			var artistId = id;
			this._artistService.deleteArtist(this.token, artistId).subscribe(
				response => {
		  			if (!response.artist) {
		  				this.errorMessage = 'Ha ocurrido un error en el servidor';
		  			} else {
		  				this.getArtists();
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