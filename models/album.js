'use strict'
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var albumSchema = schema({
	title : String,
	description : String,
	image : String,
	year : Number,
	artist : { type : schema.ObjectId, ref : 'Artist'}
});
//Guarda el id de un objeto/documento de la bd, y ese objeto es de tipo 'Artist'

//Usar el schema en otros ficheros
module.exports = mongoose.model('Album', albumSchema);