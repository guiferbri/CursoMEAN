import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'; //.pipe(map(res => res.json()));
import { Observable } from 'rxjs';//Recoger las respuestas de la peticion ajax al servidor
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {

	public url : string; //url de la api rest

	constructor(private _http : HttpClient) {
		this.url = GLOBAL.url;
	}

	addAlbum(token : string, album : Album):Observable<any> {
		let json = JSON.stringify(album);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.post(this.url + 'album', params, { headers : headers});
	}

	getAlbums(token : string, artistId : string | null):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		if (artistId != null) {
			return this._http.get(this.url + 'albums/' + artistId, { headers : headers});
		} else {
			return this._http.get(this.url + 'albums', { headers : headers});
		}
	}

	getAlbum(token : string, id : string):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.get(this.url + 'album/' + id, { headers : headers});
	}

	updateAlbum(token : string, id: string, album : Album):Observable<any> {
		let json = JSON.stringify(album);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.put(this.url + 'album/' + id, params, { headers : headers});		
	}

	deleteAlbum(token : string, id : string):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.delete(this.url + 'album/' + id, { headers : headers});
	}
}