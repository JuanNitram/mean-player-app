 'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req,res){
    var songId = req.params.songId;
    Song.findById(songId).populate({ path: 'album' }).exec(function (err,song){
        if(err){
            res.status(500).send({ message:'Error al solicitar la cancion!'});
        } else {
            if(song){
                res.status(200).send({ song });
            }
            else{
                res.status(200).send({ message:'La cancion no existe!' });               
            }
        }
    });
}

function getSongs(req,res){
    var albumId = req.params.albumId;
    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        },
        model: 'Album'
    }).exec(function(err, songs){
        if(err){
            res.status(500).send({ message:'Error al solicitar las canciones!'});
        } else {
            if(songs){
                res.status(200).send({ songs });
            }
            else{
                res.status(200).send({ message:'No hay canciones' });               
            }
        }
    });
}

function updateSong(req,res){
    var songId = req.params.songId;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update, function(err, songUpdated){
        if(err){
            res.status(500).send({ message:'Error al solicitar la actualizacion!'});
        } else {
            if(songUpdated){
                res.status(200).send({ songUpdated });
            }
            else{
                res.status(200).send({ message:'No existe la cancion!' });               
            }
        }
    });
}

function saveSong(req,res){
    var params = req.body;

    var song = new Song();
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save(function(err,songSaved){
        if(err){
            res.status(500).send({ message:'Error al guardar la cancion!'});
        }else{
            if(songSaved){
                res.status(200).send({songSaved});
            } else {
                res.status(404).send({ message:'La cancion no ha sido guardada!'});
            }
        }
    });
}

function deleteSong(req,res){
    var songId = req.params.songId;

    Song.findByIdAndRemove(songId, function(err,songRemoved){
        if(err){
            res.status(500).send({ message:'Error al borrar la cancion!'});
        }else{
            if(songRemoved){
                res.status(200).send({songRemoved});
            } else {
                res.status(404).send({ message:'No se ha borrado la cancion!'});
            }
        }
    });
}

function uploadFile(req,res){
    var songId = req.params.songId;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext == 'mp3'){
            Song.findByIdAndUpdate(songId,{file: file_name}, function(err,songUpdated){
                if(err){
                    res.status(500).send({message:'Error al subir fichero de cancion!'});
                }
                else{
                    if(!songUpdated){
                        res.status(404).send({message:'No se ha podido actualizar la cancion!'});
                    }
                    else{
                        res.status(200).send({songUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message:'Extension no valida!'});
        }
    }else{
        res.status(200).send({message : 'No has subido ningun fichero!'});
    }

}

function getSongFile(req,res){
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;
    console.log(path_file);
    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe el fichero de la cancion!'});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}