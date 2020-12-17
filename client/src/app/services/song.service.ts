import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'; //.pipe(map(res => res.json()));
import { Observable } from 'rxjs';//Recoger las respuestas de la peticion ajax al servidor
import { GLOBAL } from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService {
	public url : string; //url de la api rest

	constructor(private _http : HttpClient) {
		this.url = GLOBAL.url;
	}

	addSong(token : string, song : Song):Observable<any> {
		let json = JSON.stringify(song);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.post(this.url + 'song', params, { headers : headers});
	}

	getSongs(token : string, albumId : string | null):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		if (albumId != null) {
			return this._http.get(this.url + 'songs/' + albumId, { headers : headers});
		} else {
			return this._http.get(this.url + 'songs', { headers : headers});
		}
	}

	getSong(token : string, id : string):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.get(this.url + 'song/' + id, { headers : headers});
	}

	updateSong(token : string, id: string, song : Song):Observable<any> {
		let json = JSON.stringify(song);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.put(this.url + 'song/' + id, params, { headers : headers});		
	}

	deleteSong(token : string, id : string):Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : token
		});
		return this._http.delete(this.url + 'song/' + id, { headers : headers});
	}
}