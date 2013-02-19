/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var estudiantTeAssignaturesSchema = mongoose.Schema({
    grup_teoria:        {type: String},
    grup_practiques:    {type: String},
    grup_seminari:      {type: String},
    estudiant:          {type: mongoose.Schema.ObjectId, ref: 'Estudiant', required: true},
    assignatura:        {type: mongoose.Schema.ObjectId, ref: 'Assignatura', required: true}
});

var EstudiantTeAssignatures = mongoose.model('EstudiantTeAssignatures', estudiantTeAssignaturesSchema);

module.exports = EstudiantTeAssignatures;