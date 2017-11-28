'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var InvitadoSchema = Schema({
    asistencia: String,
    invitados: String,
    lugar: Number,
    mesa: Number,
    nombre: String,
    tel: String,
    link: String,
    user: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Invitado', InvitadoSchema);