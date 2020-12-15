import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers : [ UserService ]
})
export class AppComponent implements OnInit{
  public title = 'Musify';
  public user : User;
  public userRegister : User;
  public identity : any; //Usuario identificado. Al hacer login se guardara en el localstorage el usuario logado y dentor de identity el valor del localstorage
  public token : any;
  public errorMessage : any;
  public alertRegister? : string;
  public url : string;

  public constructor(private _userService : UserService, private _route : ActivatedRoute, private _router : Router) {
  	this.user = new User('','','','','','ROLE_USER','');
  	this.userRegister = new User('','','','','','ROLE_USER','');
  	this.url = GLOBAL.url;
  }

  //Lo que se ejcuta nada mas cargar el componente
  ngOnInit() {
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
  }

  public onSubmit() {

  	//Conseguir los datos del usuario identificado
  	this._userService.signup(this.user).subscribe(
  		response => {
  			let identity = response.user;
  			if (!identity._id) {
  				alert('Usuario no esta correctamente identificado');
  			} else {
  				this.identity = identity;
  				//Crear sesion en el localstorage para tener el usuario en sesión
  				localStorage.setItem('identity', JSON.stringify(identity));
  				//Conseguir el token para enviarselo a cada peticion http
  				this._userService.signup(this.user, 'true').subscribe(
			  		response => {
			  			let token = response.token;
			  			if (token.length <= 0) {
			  				alert('El token no se ha generado');			  				
			  			} else {
			  				//Crear elemento en el localstorage para tener el token
			  				localStorage.setItem('token', token);
			  				this.token = token;
			  				this.user = new User('','','','','','ROLE_USER','');
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

  public onSubmitRegister() {
  	console.log(this.userRegister);
  	this._userService.register(this.userRegister).subscribe(
  		response => {
  			let user = response.user;
  			this.userRegister = user;
  			if (!user._id) {
  				this.alertRegister = 'Error al registrarse';
  			} else {
  				this.alertRegister = 'Se ha registrado correctamente, identifícate con: ' + this.userRegister.email;
  				this.userRegister = new User('','','','','','ROLE_USER',''); //Inicializar para dejarlo vacío y no se quede nada de lo anterior para crear un usuario nuevo
  			}
  		}, error => {
  			var errorMessage = <any>error;
  			if (errorMessage != null) {
  				console.log(error);
  				this.alertRegister = error.error.message;
  			}
  		}
  	);
  }

  public logout() {
  	localStorage.removeItem('identity');
  	localStorage.removeItem('token');
  	localStorage.clear();
  	this.identity = null;
  	this.token = null;
  	this._router.navigate(['/']);
  }
}
