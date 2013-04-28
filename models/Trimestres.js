/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Trimestres = new Schema({
    periode:        {type: ObjectId, ref: 'Periode', required: true},
    assignatura:    {type: ObjectId, ref: 'Assignatura', required: true}
});

var Trimestres = mongoose.model('Trimestres', Trimestres);

module.exports = Trimestres;