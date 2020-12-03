'use strict'
var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();
//Crear rutas
api.get('/probando-controlador', md_auth.ensureAuth, userController.prueba);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);

module.exports = api;