'use strict'
var fs = require('fs'); //file system
var path = require('path');//rutas concretas
var mongoosePaginate = require('mongoose-pagination');//modulo paginación

//Importar modelos
var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');

function getArtist(req, res) {
	var artistId = req.params.id;

	Artist.findById(artistId, (err, artist) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (artist) {
				res.status(200).send(artist);
			} else {
				res.status(404).send({message : 'El artista no existe'});
			}
		}
	});
}

function saveArtist(req, res) {
	var params = req.body;
	var artist = new Artist();
	artist.name = params.name;
	artist.description = params.description;
	artist.image = 'null';

	console.log(params);

	if (artist.name != null && artist.description != null) {
		artist.save( (err, artistStored) => {
		if (err) {
			res.status(500).send({message : 'Ha ocurrido un error al guardar'});
		} else {
			if (!artistStored) {
				res.status(404).send({message : 'No se ha registrado el artista'});
			} else {
				res.status(200).send({artist : artistStored});
			}
		}
		});
	} else {
		res.status(200).send({message : 'Introduce todos los campos'});
	}
}

function getArtists(req, res) {

	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 2;

	Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (!artists) {
				res.status(404).send({message : 'No hay artistas'});
			} else {
				return res.status(200).send({
					totalItems : total,
					artists : artists
				});
			}
		}
	});
}

function updateArtist(req, res) {
	var artistId = req.params.id; //parametro de la url
	var update = req.body;

	Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (!artistUpdated) {
				res.status(404).send({message : 'No se ha podido actualizar el artista'});
			} else {
				res.status(200).send({artist : artistUpdated});
			}
		}
	});
}

function deleteArtist(req, res) {
	var artistId = req.params.id; //parametro de la url

	Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (!artistRemoved) {
				res.status(404).send({message : 'El artista no ha sido eliminado'});
			} else {
				Album.find({artist : artistRemoved._id}).remove((err, albumRemoved) => {
					if (err) {
						res.status(500).send({message : 'Error al eliminar los albumes'});
					} else {
						if (!albumRemoved) {
							res.status(404).send({message : 'Los albumes no han sido eliminados'});
						} else {

							Song.find({album : albumRemoved._id}).remove((err, songRemoved) => {
								if (err) {
									res.status(500).send({message : 'Error al eliminar las canciones'});
								} else {
									if (!songRemoved) {
										res.status(404).send({message : 'Las canciones no han sido eliminadas'});
									} else {
										res.status(200).send({artist : artistRemoved});
									}
								}	
							});							
						}
					}	
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var artistId = req.params.id;
	var fileName = 'No subido';
	if (req.files) {
		var filePath = req.files.image.path;
		var fileSplit = filePath.split('/');
		var fileName = fileSplit[2];

		var extSplit = fileName.split('.');
		var fileExt = extSplit[1];

		if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
			Artist.findByIdAndUpdate(artistId, {image : fileName}, (err, artistUpdated) => {
				if (err) {
					res.status(500).send({message : 'Error al añadir la imagen al artista'});
				} else {
					if (!artistUpdated) {
						res.status(404).send({message : 'No se ha podido añadir la imagen al artista'});
					} else {
						res.status(200).send({artist : artistUpdated});
					}
				}
			});
		} else {
			res.status(200).send({message : 'Extensión del archivo no válida'});
		}
	} else {
		res.status(404).send({message : 'No ha subido ninguna imagen'});
	}
}

function getImageFile(req, res) {
	var imageFile = req.params.imageFile;
	//comprobar si exsiste el fichero
	var pathFile = './uploads/artists/' + imageFile;
	fs.exists(pathFile, function(exists){
		if (exists) {
			res.sendFile(path.resolve(pathFile));
		} else {
			res.status(404).send({message : 'No existe la imagen'});
		}
	});
}

module.exports = {
	getArtist,
	saveArtist,
	getArtists,
	updateArtist,
	deleteArtist,
	uploadImage,
	getImageFile
};