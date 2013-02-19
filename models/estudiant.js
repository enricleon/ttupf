/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var estudiantSchema = mongoose.Schema({
    nom: 'string',
    nia: 'string',
    password: 'string',
    email: 'string'
});

var Estudiant = mongoose.model('Estudiant', estudiantSchema);

module.exports = Estudiant;