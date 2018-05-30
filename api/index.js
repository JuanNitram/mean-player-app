'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3000;
mongoose.connect('mongodb://localhost:27017/curso_mean2', function(err,res){
    if(err){
        throw err;
    }
    else {
        console.log("CONEXION BD EXITOSA!");
        app.listen(port,function(){
            console.log("SERVIDOR CORRIENDO EN http://localhost:"+port);
        })
    }
});