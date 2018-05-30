'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    /*Album.findById(albumId, function(err,album){
        if(err){
            res.status(500).send({ message:'Error al solicitar Album!'});
        }else{
            if(album){
                res.status(200).send({album});
            }else{
                res.status(404).send({ message:'No existe el Album!'});
            }
        }
    });*/

    Album.findById(albumId).populate({ path: 'artist' }).exec(function (err, album) {
        if (err) {
            res.status(500).send({ message: 'Error al solicitar Album!' });
        } else {
            if (album) {
                res.status(200).send({ album });
            } else {
                res.status(404).send({ message: 'No existe el Album!' });
            }
        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.albumId;
    var update = req.body;
    Album.findByIdAndUpdate(albumId, update, function (err, albumUpdated) {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar album!' });
        } else {
            if (albumUpdated) {
                res.status(200).send({ albumUpdated });
            } else {
                res.status(404).send({ message: 'No existe el Album!' });
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save(function (err, albumStored) {
        if (err) {
            res.status(500).send({ message: 'Error al registrar Album!' });
        } else {
            if (albumStored) {
                res.status(200).send({ albumStored });
            } else {
                res.status(404).send({ message: 'No se ha registrado album!' });
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artistId;
    var findAlbums;
    if (!artistId) {
        //Sacar todos los albums de la base de datos
        findAlbums = Album.find({}).sort('title');
    } else {
        //Sacar los albums de un artista concreto de la base de datos
        findAlbums = Album.find({ artist: artistId }).sort('year');
    }
    findAlbums.populate({ path: 'artist' }).exec(function (err, albums) {
        if (err) {
            res.status(500).send({ message: 'Error al registrar Album!' });
        } else {
            if (albums) {
                res.status(200).send({ albums });
            } else {
                res.status(404).send({ message: 'No hay albums!' });
            }
        }
    }); // El path indica en que cmpo va a popular datos

}

function deleteAlbum(req, res) {
    var albumId = req.params.albumId;
    Album.findByIdAndRemove(albumId, function (err, albumRemoved) {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar album!' });
        } else {
            if (albumRemoved) {
                Song.find({ album: albumRemoved._id }).remove(function (err, songRemoved) {
                    if (err) {
                        res.status(500).send({ message: 'Error al eliminar song!' });
                    } else {
                        if (songRemoved) {
                            res.status(200).send({ albumRemoved });
                        } else {
                            res.status(404).send({ message: 'El song no ha sido eliminado!' });
                        }
                    }
                });
            } else {
                res.status(404).send({ message: 'El albume no ha sido eliminado!' });
            }
        }
    });
}

function uploadImage(req,res){
    var albumId = req.params.albumId;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext=='gif'){
            Album.findByIdAndUpdate(albumId,{image: file_name}, function(err,albumUpdated){
                if(err){
                    res.status(500).send({message:'Error al actualizar usuario!'});
                }
                else{
                    if(!albumUpdated){
                        res.status(404).send({message:'No se ha podido actualizar el usuario!'});
                    }
                    else{
                        res.status(200).send({albumUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message:'Extension no valida!'});
        }
    }else{
        res.status(200).send({message : 'No has subido ninguna imagen!'});
    }

}

function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/'+imageFile;
    fs.exists('./uploads/albums/'+imageFile,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen!'});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}