import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'; //.pipe(map(res => res.json()));
import { Observable } from 'rxjs';//Recoger las respuestas de la peticion ajax al servidor
import { GLOBAL } from './global';
import { User } from '../models/user';

//@Injectable -> Permite mediante inyeccion de dependencias inyectar este servicio/clase en otros componentes/clases y poder utilizarla
@Injectable()
export class UserService{

	public identity : any;
	public token : string | any;
	public url : string; //url de la api rest

	constructor(private _http : HttpClient) {
		this.url = GLOBAL.url;
	}

	//gethash por defecto a null. Si le pasamos el gethash devuelve todos los datos del usuario a logar y si se envia gethash nos devuelve el token
	signup(userToLogin : any, gethash? : string | null):Observable<any> {

		if (gethash != null) {
			userToLogin.gethash = gethash;
		}

		let json = JSON.stringify(userToLogin);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
		});

		return this._http.post(this.url + 'login', params, { headers : headers});
	}

	register(userToRegister : User):Observable<any> {

		let json = JSON.stringify(userToRegister);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
		});

		return this._http.post(this.url + 'register', params, { headers : headers});
	}

	updateUser(userToUpdate : User) : Observable<any> {

		let json = JSON.stringify(userToUpdate);
		let params = json;
		let headers = new HttpHeaders({
			'Content-Type' : 'application/json',
			'Authorization' : this.getToken()
		});

		return this._http.put(this.url + 'update-user/' + userToUpdate._id, params, { headers : headers});
	}

	getIdentity() {
		let identityJSON = localStorage.getItem('identity');
		if (identityJSON != undefined) {
			let identity = JSON.parse(identityJSON);
			if (identity != undefined) {
				this.identity = identity;
			} else {
				this.identity = null;
			}
		} else {
			this.identity = null;			
		}

		return this.identity;
	}

	getToken() {
		let token = localStorage.getItem('token');
		if (token != undefined) {
			this.token = token;
		} else {
			this.token = null;
		}

		return this.token; 
	}

}