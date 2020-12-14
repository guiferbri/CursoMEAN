import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

//Metadata y caracteristica que va a tener
@Component({
  selector: 'user-edit',
  templateUrl: '../views/user-edit.html',
  providers : [ UserService ]
})

export class UserEditComponent implements OnInit {
	public title : string;
	public user : User;
	public identity : any;
	public token : string;
	public alertMessage? : string;
	public filesToUpload? : Array<File>;
	public url : string;

	constructor(private _userService : UserService) {
		this.title = 'Actualizar mis datos';

		//LocalStorage
		this.identity = this._userService.getIdentity(); //Se puede poner en el oninit
  		this.token = this._userService.getToken(); //Se puede poner en el oninit
		this.user = this.identity;
		this.url = GLOBAL.url;
	}

	ngOnInit() {
	}

	onSubmit() {
		this._userService.updateUser(this.user).subscribe(
			response => {
				if (!response.user) {
					this.alertMessage = 'El usuario no se ha actualizado';
				} else {
					this.identity = this.user; //Se pone this.user porq la respuesta del servicio devuelve lso dtaos del usuario antiguos
  					localStorage.setItem('identity', JSON.stringify(this.user));
  					//Añadir la imagen
  					if (this.filesToUpload) {
  						//then porque devuelve una promesa
  						this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [],this.filesToUpload).then((result : any) => {
  							this.user.image = result.image;
  							localStorage.setItem('identity', JSON.stringify(this.user));
	  						let imagePath = this.url + 'get-image-user/' + this.user.image;
	  						document.getElementById('imageLogged')!.setAttribute('src', imagePath);
  						});
  					}
					//this.user = response.user;
  					document.getElementById('identityName')!.innerHTML = this.user.name + ' ' + this.user.surname;
  					this.alertMessage = 'El usuario se ha actualizado correctamente';
				}
			},
			error => {
				var errorMessage = <any>error;
	  			if (errorMessage != null) {
	  				console.log(error);
	  				this.alertMessage = error.error.message;
	  			}
			}
		);
	}

	fileChangeEvent(fileInput : any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	makeFileRequest(url : string, params : Array<string>, files : Array<File>) {
		var token = this.token;
		//promesa lanza el codigo de la subida;
		return new Promise(function(resolve, reject){
			var formData : any = new FormData(); //Para simular el comportamiento de un formulario
			var xhr = new XMLHttpRequest();//Peticion ajax js

			for (var i = 0; i < files.length; i++) {
				formData.append('image', files[i], files[i].name);
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