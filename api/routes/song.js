'use strict'

var express = require('express');
var multipart = require('connect-multiparty');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var SongController = require('../controllers/song');
var md_upload = multipart({ uploadDir: './uploads/songs' });

api.get('/getSong/:songId',md_auth.ensureAuth,SongController.getSong);
api.post('/song',md_auth.ensureAuth,SongController.saveSong);
api.get('/getSongs/:albumId?',md_auth.ensureAuth,SongController.getSongs);
api.put('/song/:songId',md_auth.ensureAuth,SongController.updateSong);
api.delete('/song/:songId',md_auth.ensureAuth,SongController.deleteSong);

api.post('/uploadsongFile/:songId',[md_auth.ensureAuth,md_upload],SongController.uploadFile);
api.get('/getSongFile/:songFile',SongController.getSongFile);

module.exports = api;