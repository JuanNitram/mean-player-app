'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req,res){
    var artistId = req.params.id;

    Artist.findById(artistId, function(err,artist){
        if(err){
            res.status(500).send({ message:'Error al solicitar artista!'});
        }else{
            if(artist){
                res.status(200).send({artist});
            }else{
                res.status(404).send({ message:'No existe el artista!'});
            }
        }
    });
}

function getArtists(req,res){
    var page;
    if(req.params.page){
        page = req.params.page;
    }else{
        page = 1;
    }
    var itemsPerPage = 10;
    Artist.find().sort('name').paginate(page,itemsPerPage,function(err,artists,total){
        if(err){
            res.status(500).send({ message:'Error al solicitar artistas!'});
        }else{
            if(artists){
                res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }else{
                res.status(404).send({ message:'No hay artistas!'});
            }
        }
    });

}

function saveArtist(req,res){
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    artist.save(function(err,artistStored){
        if(err){
            res.status(500).send({message:'Error al guardar artista!'});
        }else{
            if(artistStored){
                res.status(200).send({artistStored});
            }else{
            res.status(404).send({message:'El artista no ha sido guardado!'});
            }
        }
    });
}

function updateArtist(req,res){
    var artistId = req.params.id;
    var params = req.body;
    Artist.findByIdAndUpdate(artistId,params, function(err,artistUpdated){
        if(err){
            res.status(500).send({message:'Error al actualizar artista!'});
        }else{
            if(artistUpdated){
                res.status(200).send({artistUpdated});
            }else{
                res.status(404).send({message:'El artista no ha sido actualizado!'});
            }
        }
    });
}

function deleteArtist(req,res){
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, function(err,artistRemoved){
        if(err){
            res.status(500).send({message:'Error al eliminar artista!'});           
        }else{
            if(artistRemoved){
                Album.find({artist : artistRemoved._id}).remove(function(err,albumRemoved){
                    if(err){
                        res.status(500).send({message:'Error al eliminar album!'});
                    }else{
                        if(albumRemoved){
                            Song.find({album : albumRemoved._id}).remove(function(err,songRemoved){
                                if(err){
                                    res.status(500).send({message:'Error al eliminar song!'});
                                }else{
                                    if(songRemoved){
                                        res.status(200).send({artistRemoved});
                                    }else{
                                        res.status(404).send({message:'El song no ha sido eliminado!'});
                                    }
                                }
                            });
                        }else{
                            res.status(404).send({message:'El albume no ha sido eliminado!'});
                        }
                    }
                });
            }else{
                res.status(404).send({message:'El artista no ha sido eliminado!'});
            }
        }
    });
}

function uploadImage(req,res){
    var artistId = req.params.id;
    var file_name = 'No subido';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext=='gif'){
            Artist.findByIdAndUpdate(artistId,{image: file_name}, function(err,artistUpdated){
                if(err){
                    res.status(500).send({message:'Error al actualizar usuario!'});
                }
                else{
                    if(!artistUpdated){
                        res.status(404).send({message:'No se ha podido actualizar el usuario!'});
                    }
                    else{
                        res.status(200).send({artistUpdated});
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
    var path_file = './uploads/artists/'+imageFile;
    fs.exists('./uploads/artists/'+imageFile,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen!'});
        }
    });
}

module.exports = {
    getArtist,
    getArtists,
    saveArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}