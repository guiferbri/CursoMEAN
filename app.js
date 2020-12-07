'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var userRoutes = require('./routes/user');
var artistRoutes = require('./routes/artist');
var albumRoutes = require('./routes/album');

//Convierte a json los datos que nos llegan por http
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Configurar cabeceras http

//Rutas base
app.use('/api', userRoutes); //Añade delante de lo definido en userRoutes el 'api'
app.use('/api', artistRoutes); //Añade delante de lo definido en userRoutes el 'api'
app.use('/api', albumRoutes); //Añade delante de lo definido en userRoutes el 'api'

//PRUEBA
/*app.get('/pruebas', function(req, res) {
	res.status(200).send({message : 'Hola!'});
});*/

//Con esto podemos usar app en otros ficheros que incluya app
module.exports = app;