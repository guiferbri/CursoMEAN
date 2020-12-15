import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'; //.pipe(map(res => res.json()));
import { Observable } from 'rxjs';//Recoger las respuestas de la peticion ajax al servidor
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService {

	public url : string; //url de la api rest

	constructor(private _http : HttpClient) {
		this.url = GLOBAL.url;
	}

	addArtist(token : string, artist : Artist):Observable<any> {
		let json = JSON.stringify(artist);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.post(this.url + 'artist', params, { headers : headers});
	}

	getArtists(token : string, page : any):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.get(this.url + 'artists/' + page, { headers : headers});
	}

	getArtist(token : string, id : string):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.get(this.url + 'artist/' + id, { headers : headers});
	}

	updateArtist(token : string, id: string, artist : Artist):Observable<any> {
		let json = JSON.stringify(artist);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.put(this.url + 'artist/' + id, params, { headers : headers});		
	}

	deleteArtist(token : string, id : string):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.delete(this.url + 'artist/' + id, { headers : headers});
	}
}