'use strict'

//Cargar librería/modulo
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977; //puerto para nuestro servidor de node

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://adminCursoMean2:adminCursoMean2@127.0.0.1:27017/curse_mean2', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
	if (err) {
		throw err;
	} else {
		console.log('Todo OK!');
		app.listen(port, function(){
			console.log('Listen!!');
		});
	}
})