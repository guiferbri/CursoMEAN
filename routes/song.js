'use strict'
var express = require('express');
var songController = require('../controllers/song');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir : './uploads/songs/'});

//Crear rutas
api.get('/song/:id', md_auth.ensureAuth, songController.getSong);
api.post('/song', md_auth.ensureAuth, songController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, songController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, songController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, songController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], songController.uploadFile);
api.get('/get-file-song/:songFile', songController.getSongFile);

module.exports = api;