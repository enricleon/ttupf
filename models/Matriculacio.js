/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Matriculacio = new Schema({
    grup_teoria:        {type: String},
    grup_practiques:    {type: String},
    grup_seminari:      {type: String},
    estudiant:          {type: ObjectId, ref: 'Estudiant', required: true},
    assignatura:        {type: ObjectId, ref: 'Assignatura', required: true}
});

var Matriculacio = mongoose.model('Matriculacio', Matriculacio);

module.exports = Matriculacio;