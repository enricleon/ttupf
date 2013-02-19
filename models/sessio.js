/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var sessioSchema = mongoose.Schema({
    tipus: 'string',
    grup: 'string',
    aula: 'string',
    comentari: 'string',
    periode:        { type: mongoose.Schema.ObjectId, ref: 'Periode'},
    assignatura:    { type: mongoose.Schema.ObjectId, ref: 'Assignatura'}
});

var Sessio = mongoose.model('Sessio', sessioSchema);

module.exports = Sessio;