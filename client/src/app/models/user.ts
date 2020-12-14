//Definir la clase. Con export permitimos que sea importada en otros ficheros y que se pued autilziar este fichero (modelo) en otros 
export class User {
	//no hace falta los getter y setter porque al definir la propiedad como parametro es lo mismo que:
	//Definir fuera: public _id: string y dentro del constructor:
	//constructor(_id : string)
	// this._id = _id;

	//es obligatorio ponerle visibilidad (public, private..)
	constructor(
		public _id : string, 
		public name : string,
		public surname : string,
		public email : string,
		public password : string,
		public role : string,
		public image : string) {

	}
}