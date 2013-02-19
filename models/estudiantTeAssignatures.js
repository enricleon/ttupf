/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var estudiantTeAssignaturesSchema = mongoose.Schema({
    grup_teoria:        'string',
    grup_practiques:    'string',
    grup_seminari:      'string',
    estudiant:          { type: mongoose.Schema.ObjectId, ref: 'Estudiant'},
    assignatura:        { type: mongoose.Schema.ObjectId, ref: 'Assignatura'}
});

var EstudiantTeAssignatures = mongoose.model('EstudiantTeAssignatures', estudiantTeAssignaturesSchema);

module.exports = EstudiantTeAssignatures;