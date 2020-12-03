'use strict'
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var artistSchema = Schema({
	name : String,
	description : String,
	image : String
});

//Usar el schema en otros ficheros
module.exports = mongoose.model('Artist', artistSchema);