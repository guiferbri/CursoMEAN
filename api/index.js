'use strict'

//Cargar librería/modulo
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000; //puerto para nuestro servidor de node

//mongoose.Promise = global.Promise;
const uriDB = process.env.MONGO_URI || 'mongodb://adminCursoMean2:adminCursoMean2@127.0.0.1:27017/curse_mean2';
mongoose.connect(uriDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, res) => {
	if (err) {
		throw err;
	} else {
		console.log('Todo OK!');
		app.listen(port, function(){
			console.log('Listen on !!' + port);
		});
	}
})