/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Matriculacio = require('./Matriculacio');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Estudiant = new Schema({
    nom:            {type: String},
    nia:            {type: String, required: true, unique: true, index: true},
    password:       {type: String},
    email:          {type: String, required: true, unique: true, index: true},
    matriculacions: [Matriculacio]
});

var Estudiant = mongoose.model('Estudiant', Estudiant);

module.exports = Estudiant;