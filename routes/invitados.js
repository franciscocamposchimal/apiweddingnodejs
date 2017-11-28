'use strict'

var express = require('express');
var InvitadoController = require('../controllers/invitados');

var api = express.Router();
var md_auth = require('../middleware/authenticate');
var md_admin = require('../middleware/is_admin');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/invitados' });

api.post('/new-invitado', [md_auth.ensureAuth, md_admin.isAdmin], InvitadoController.saveInvitado);
api.get('/invitados', InvitadoController.getInvitados);
api.get('/invitado/:id', InvitadoController.getInvitado);
api.put('/invitado/:id', InvitadoController.updateInvitado);
//api.post('/upload-image-invitado/:id', [md_auth.ensureAuth, md_admin.isAdmin, md_upload], InvitadoController.uploadImage);
//api.get('/get-image-file-invitado/:imageFile', InvitadoController.getImageFile);
api.delete('/invitado/:id', [md_auth.ensureAuth, md_admin.isAdmin], InvitadoController.deleteInvitado);

module.exports = api;