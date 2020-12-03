'use strict'
var mongoose = require('mongoose');
var schema = mongoose.Schema;
var userSchema = schema({
	name : String,
	surname : String,
	email : String,
	password : String,
	role : String,
	image : String
});

//Usar el schema en otros ficheros
module.exports = mongoose.model('User', userSchema);