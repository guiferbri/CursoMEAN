import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'; //.pipe(map(res => res.json()));
import { Observable } from 'rxjs';//Recoger las respuestas de la peticion ajax al servidor
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class UploadService {

	public url : string; //url de la api rest

	constructor(private _http : HttpClient) {
		this.url = GLOBAL.url;
	}

	makeFileRequest(url : string, params : Array<string>, files : Array<File>, token : string, name : string) {
		//promesa lanza el codigo de la subida;
		return new Promise(function(resolve, reject){
			var formData : any = new FormData(); //Para simular el comportamiento de un formulario
			var xhr = new XMLHttpRequest();//Peticion ajax js

			for (var i = 0; i < files.length; i++) {
				formData.append(name, files[i], files[i].name);
			}

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					} else {
						reject(xhr.response);
					}
				}
			}

			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}
}