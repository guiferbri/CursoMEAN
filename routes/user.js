'use strict'
var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();
//Crear rutas
api.get('/probando-controlador', userController.prueba);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);

module.exports = api;