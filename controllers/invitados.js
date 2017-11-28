'use strict'
//modulos
var fs = require('fs');
var path = require('path');

//modelos
var User = require('../models/user');
var Invitado = require('../models/invitado');

//acciones
function pruebas(req, res) {
    res.status(200).send({
        message: 'Constrolador invitado',
        user: req.user
    });
}

function saveInvitado(req, res) {
    var invitado = new Invitado();

    var params = req.body;

    if (params.nombre) {
        invitado.asistencia = '0',
        invitado.invitados = '1',
        invitado.lugar = '0',
        invitado.mesa = null,
        invitado.nombre =  params.nombre,
        invitado.tel = params.tel,
        invitado.link =  null,
        invitado.user = req.user.sub;

        invitado.save((err, invitadoStored) => {
            if (err) {
                res.status(500).send({ message: 'Error en el servidor...' });
            } else {
                if (!invitadoStored) {
                    res.status(404).send({ message: 'No se ha guardado...' });
                } else {
                    res.status(200).send({ invitado: invitadoStored });
                }
            }
        });
    } else {
        res.status(200).send({
            message: 'El nombre del invitado es obligatorio...'
        });
    }
}

function getInvitados(req, res) {
    Invitado.find({}).populate({ path: 'user' }).exec((err, invitados) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion..' });
        } else {
            if (!invitados) {
                res.status(404).send({ message: 'No hay invitadoss..' });
            } else {
                res.status(200).send({ invitados });
            }
        }
    });
}


function getInvitado(req, res) {

    var invitadoId = req.params.id;
    Invitado.findById(invitadoId).populate({ path: 'user' }).exec((err, invitado) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion..' });
        } else {
            if (!invitado) {
                res.status(404).send({ message: 'Invitado no existe..' });
            } else {
                res.status(200).send({ invitado });
            }
        }
    });
}

function updateInvitado(req, res) {
    var invitadoId = req.params.id;
    var update = req.body;
    Invitado.findByIdAndUpdate(invitadoId, update, { new: true }, (err, invitadoUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion...' });
        } else {
            if (!invitadoUpdated) {
                res.status(404).send({ message: 'No se ha actualizado..' });
            } else {
                res.status(200).send({ invitado: invitadoUpdated });
            }
        }
    });
}

function uploadImage(req, res) {
    var invitadoId = req.params.id;
    var file_name = 'Sin archivo...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            Invitado.findByIdAndUpdate(invitadoId, { image: file_name }, { new: true }, (err, invitadoUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar' });
                } else {
                    if (!invitadoUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar' });
                    } else {
                        res.status(200).send({ invitado: invitadoUpdated, image: file_name });
                    }
                }
            });
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    res.status(200).send({ message: "Extension de archivo no valido y no borrado..." });
                } else {
                    res.status(200).send({ message: "Extension de archivo no valido..." });
                }
            });

        }

    } else {
        res.status(200).send({ message: "No se logro subir el archivo..." });
    }
}

function getImageFile(req, res) {
    var imagefile = req.params.imageFile;
    var path_file = './uploads/invitados/' + imagefile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: "La imagen no existe..." });
        }
    });
}

function deleteInvitado(req, res) {
    var invitadoId = req.params.id;

    Invitado.findByIdAndRemove(invitadoId, (err, invitadoRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion...' });
        } else {
            if (!invitadoRemoved) {
                res.status(404).send({ message: 'No se ha podido elimnar...' })
            } else {
                res.status(200).send({ invitado: invitadoRemoved });
            }
        }
    });
}

module.exports = {
    pruebas,
    saveInvitado,
    getInvitados,
    getInvitado,
    updateInvitado,
    uploadImage,
    getImageFile,
    deleteInvitado
};