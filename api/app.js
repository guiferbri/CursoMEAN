'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Angular deploy
app.use(express.static('public/dist'));

//Cargar rutas
var userRoutes = require('./routes/user');
var artistRoutes = require('./routes/artist');
var albumRoutes = require('./routes/album');
var songRoutes = require('./routes/song');

//Convierte a json los datos que nos llegan por http
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Middleware para configurar cabeceras http
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); //Acceso a todos los dominios
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'); //Cabeceras necesarias para que el API a nivel de Ajax funcione
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next()
});

//Rutas base
app.use('/api', userRoutes); //Añade delante de lo definido en userRoutes el 'api'
app.use('/api', artistRoutes); //Añade delante de lo definido en userRoutes el 'api'
app.use('/api', albumRoutes); //Añade delante de lo definido en userRoutes el 'api'
app.use('/api', songRoutes); //Añade delante de lo definido en userRoutes el 'api'

//Angular deploy
const path = require('path');
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname + '/../public/dist/index.html'));
});

//PRUEBA
/*app.get('/pruebas', function(req, res) {
	res.status(200).send({message : 'Hola!'});
});*/

//Con esto podemos usar app en otros ficheros que incluya app
module.exports = app;