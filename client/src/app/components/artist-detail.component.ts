import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../models/user';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'artist-detail',
  templateUrl: '../views/artist-detail.html',
  providers : [ UserService, ArtistService ]
})

export class ArtistDetailComponent implements OnInit {
	public artist? : Artist;
	public identity : any;
	public token : any;
  	public errorMessage : any;
  	public url : string;
	public id : any;
	public albums? : Album[];

	public constructor(private _route : ActivatedRoute, private _router : Router, 
		private _userService : UserService, private _artistService : ArtistService) {
	  	this.url = GLOBAL.url;
	  	this.identity = this._userService.getIdentity();
	  	this.token = this._userService.getToken();
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

	  				//Sacar los albums
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