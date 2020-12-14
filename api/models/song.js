'use strict'
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var songSchema = schema({
	number : String,
	name : String,
	duration : String,
	file : String,
	album : { type : schema.ObjectId, ref : 'Album'}
});

//Usar el schema en otros ficheros
module.exports = mongoose.model('Song', songSchema);