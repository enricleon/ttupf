/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var periodeTeAssignaturesSchema = mongoose.Schema({
    periode:        { type: mongoose.Schema.ObjectId, ref: 'Periode'},
    assignatura:    { type: mongoose.Schema.ObjectId, ref: 'Assignatura'}
});

var PeriodeTeAssignatures = mongoose.model('PeriodeTeAssignatures', periodeTeAssignaturesSchema);

module.exports = PeriodeTeAssignatures;