'use strict'
var fs = require('fs'); //file system
var path = require('path');//rutas concretas
var mongoosePaginate = require('mongoose-pagination');//modulo paginación

//Importar modelos
var Artist = require('../models/artist');
var Song = require('../models/song');
var Album = require('../models/song');

function getSong(req, res) {
	var songId = req.params.id;

	//path -> propiedad donde se van a cargar los datos del objeto asociado
	//Se tendría en el song todos los datos del artista asociado
	Song.findById(songId).populate({ path : 'album'}).exec((err, song) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (song) {
				res.status(200).send(song);
			} else {
				res.status(404).send({message : 'La canción no existe'});
			}
		}
	});
}

function saveSong(req, res) {
	var params = req.body;
	var song = new Song();
	song.number = params.number;
	song.name = params.name;
	song.duration = params.duration;
	song.file = null;
	song.album = params.album;

	console.log(params);

	if (song.name != null && song.album != null) {
		song.save( (err, songStored) => {
		if (err) {
			res.status(500).send({message : 'Ha ocurrido un error al guardar'});
		} else {
			if (!songStored) {
				res.status(404).send({message : 'No se ha registrado la canción'});
			} else {
				res.status(200).send({song : songStored});
			}
		}
		});
	} else {
		res.status(200).send({message : 'Introduce todos los campos'});
	}
}

function getSongs(req, res) {

	var albumId = req.params.album;
	var find;
	if (albumId) {
		find = Song.find({album : albumId}).sort('number');		
	} else {
		//Sacar todos las songs
		find = Song.find().sort('name');
	}
	//Para popular la informacion del album y del artista del album
	find.populate({ 
			path : 'album', 
			populate : {
				path : 'artist',
				model : 'Artist'
			}
		}).exec((err, songs) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (songs) {
				res.status(200).send(songs);
			} else {
				res.status(404).send({message : 'No hay songs'});
			}
		}
	});
}

function updateSong(req, res) {
	var songId = req.params.id; //parametro de la url
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
		if (err) {
			res.status(500).send({message : 'Error en la petición'});
		} else {
			if (!songUpdated) {
				res.status(404).send({message : 'No se ha podido actualizar el songa'});
			} else {
				res.status(200).send({song : songUpdated});
			}
		}
	});
}

function deleteSong(req, res) {
	var songId = req.params.id; //parametro de la url

	Song.findByIdAndRemove(songId, (err, songRemoved) => {
		if (err) {
			res.status(500).send({message : 'Error al eliminar la canción'});
		} else {
			if (!songRemoved) {
				res.status(404).send({message : 'La canción no ha sido eliminada'});
			} else {
				res.status(200).send({song : songRemoved});						
			}
		}	
	});
}

function uploadFile(req, res) {
	var songId = req.params.id;
	var fileName = 'No subido';
	if (req.files) {
		var filePath = req.files.file.path;
		var fileSplit = filePath.split('/');
		var fileName = fileSplit[2];

		var extSplit = fileName.split('.');
		var fileExt = extSplit[1];

		if (fileExt == 'mp3' || fileExt == 'ogg') {
			Song.findByIdAndUpdate(songId, {file : fileName}, (err, songUpdated) => {
				if (err) {
					res.status(500).send({message : 'Error en la petición'});
				} else {
					if (!songUpdated) {
						res.status(404).send({message : 'No se ha podido añadir el fichero a la canción'});
					} else {
						res.status(200).send({song : songUpdated});
					}
				}
			});
		} else {
			res.status(200).send({message : 'Extensión del archivo no válida'});
		}
	} else {
		res.status(404).send({message : 'No ha subido ningun fichero'});
	}
}

function getSongFile(req, res) {
	var songFile = req.params.songFile;
	//comprobar si exsiste el fichero
	var pathFile = './uploads/songs/' + songFile;
	fs.exists(pathFile, function(exists){
		if (exists) {
			res.sendFile(path.resolve(pathFile));
		} else {
			res.status(404).send({message : 'No existe el fichero de audio'});
		}
	});
}

module.exports = {
	getSong,
	saveSong,
	getSongs,
	updateSong,
	deleteSong,
	uploadFile,
	getSongFile
}