'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

//req lo que recibe, res lo que devuelve
function prueba(req, res) {
	res.status(200).send({message : 'Hola caracola acción user controller'});
}

function saveUser(req, res) {
	var params = req.body;
	var user = new User();
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	console.log(params);

	if (params.password) {
		bcrypt.hash(params.password, null, null, function(err, hash){
			if (!err) {
				user.password = hash;
				if (user.name != null && user.surname != null && user.email != null) {
					user.save( (err, userStored) => {
						if (err) {
							res.status(500).send({message : 'Ha ocurrido un error al guardar'});
						} else {
							if (!userStored) {
								res.status(404).send({message : 'No se ha registrado el usuario'});
							} else {
								res.status(200).send({user : userStored});
							}
						}
					});
				} else {
					res.status(200).send({message : 'Introduce todos los campos'});
				}
			}
		});
	} else {
		res.status(200).send({message : 'Introduce la contraseña'});
	}
}

function loginUser(req, res) {
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email : email.toLowerCase()}, (err, user) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (!user) {
				res.status(404).send({message : 'El usuario no existe'});
			} else {
				bcrypt.compare(password, user.password, (err, check) => {
					if (check) {
						if (params.gethash) {
							//devolver token jwt
							res.status(200).send({token : jwt.createToken(user)});
						} else {
							res.status(200).send({user});
						}
					} else {
						res.status(404).send({message : 'No se ha podido logear'});
					}
				});
			}
		}
	}); //Busca todos los usuarios cuyo email sea el email

}

module.exports = {
	prueba,
	saveUser,
	loginUser
};