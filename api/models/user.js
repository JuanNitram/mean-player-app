'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; // Nos va permitir definir esquemas de la base de datos

var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports =  mongoose.model('User',UserSchema); // Cuando utilicemos el UserSchema vamos a tener un objeto User (Instanciable)