'use strict'
var fs = require('fs'); //file system
var path = require('path');//rutas concretas
var mongoosePaginate = require('mongoose-pagination');//modulo paginación

//Importar modelos
var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/album');

function getAlbum(req, res) {
	var albumId = req.params.id;

	//path -> propiedad donde se van a cargar los datos del objeto asociado
	//Se tendría en el album todos los datos del artista asociado
	Album.findById(albumId).populate({ path : 'artist'}).exec((err, album) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (album) {
				res.status(200).send(album);
			} else {
				res.status(404).send({message : 'El album no existe'});
			}
		}
	});
}

function saveAlbum(req, res) {
	var params = req.body;
	var album = new Album();
	album.title = params.title;
	album.description = params.description;
	album.image = 'null';
	album.year = params.year;
	album.artist = params.artist;

	console.log(params);

	if (album.title != null && album.artist != null) {
		album.save( (err, albumStored) => {
		if (err) {
			res.status(500).send({message : 'Ha ocurrido un error al guardar'});
		} else {
			if (!albumStored) {
				res.status(404).send({message : 'No se ha registrado el album'});
			} else {
				res.status(200).send({album : albumStored});
			}
		}
		});
	} else {
		res.status(200).send({message : 'Introduce todos los campos'});
	}
}

function getAlbums(req, res) {

	var artistId = req.params.artist;
	var find;
	if (artistId) {
		find = Album.find({artist : artistId}).sort('title');		
	} else {
		//Sacar todos los albums
		find = Album.find().sort('year');
	}
	/*var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemsPerPage = 2;

	find.populate({ path : 'artist'}).paginate(page, itemsPerPage, (err, albums, total) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (!albums) {
				res.status(404).send({message : 'No hay albumes'});
			} else {
				return res.status(200).send({
					totalItems : total,
					albums : albums
				});
			}
		}
	});*/
	find.populate({ path : 'artist'}).exec((err, albums) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (albums) {
				res.status(200).send(albums);
			} else {
				res.status(404).send({message : 'No hay albums'});
			}
		}
	});
}

function updateAlbum(req, res) {
	var albumId = req.params.id; //parametro de la url
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (!albumUpdated) {
				res.status(404).send({message : 'No se ha podido actualizar el albuma'});
			} else {
				res.status(200).send({album : albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res) {
	var albumId = req.params.id; //parametro de la url

	Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
		if (err) {
			res.status(500).send({message : 'Error al eliminar el album'});
		} else {
			if (!albumRemoved) {
				res.status(404).send({message : 'El album no ha sido eliminado'});
			} else {
				Song.find({album : albumRemoved._id}).remove((err, songRemoved) => {
					if (err) {
						res.status(500).send({message : 'Error al eliminar las canciones'});
					} else {
						if (!songRemoved) {
							res.status(404).send({message : 'Las canciones no han sido eliminadas'});
						} else {
							res.status(200).send({album : albumRemoved});
						}
					}	
				});							
			}
		}	
	});
}

function uploadImage(req, res) {
	var albumId = req.params.id;
	var fileName = 'No subido';
	if (req.files) {
		var filePath = req.files.image.path;
		var fileSplit = filePath.split('/');
		var fileName = fileSplit[2];

		var extSplit = fileName.split('.');
		var fileExt = extSplit[1];

		if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
			Album.findByIdAndUpdate(albumId, {image : fileName}, (err, albumUpdated) => {
				if (err) {
					res.status(500).send({message : 'Error al añadir la imagen al album'});
				} else {
					if (!albumUpdated) {
						res.status(404).send({message : 'No se ha podido añadir la imagen al album'});
					} else {
						res.status(200).send({album : albumUpdated});
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
	var pathFile = './uploads/albums/' + imageFile;
	fs.exists(pathFile, function(exists){
		if (exists) {
			res.sendFile(path.resolve(pathFile));
		} else {
			res.status(404).send({message : 'No existe la imagen'});
		}
	});
}

module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
}