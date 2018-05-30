'use strict'

var express = require('express');
var UserController = require('../controllers/user'); // Con los dos puntos saltamos dos directorios arriba
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir:'./uploads/users'}); // Aqui se van a subir todas las imagenes de perfil de cada usuario
var api = express.Router();


api.get('/pruebasControlador',md_auth.ensureAuth,UserController.pruebas); // Queremos proteger este metodo, por lo tanto utilizamos el middleware de autenticacion

api.post('/register',UserController.saveUser);

api.post('/login',UserController.loginUser);

api.put('/updateUser/:id',md_auth.ensureAuth,UserController.updateUser); // Utilizo metodos HTTP put para actualizar informacion

api.post('/uploadImageUser/:id',[md_auth.ensureAuth, md_upload],UserController.uploadImage);

api.get('/getImageFile/:imageFile', UserController.getImageFile);

module.exports = api;