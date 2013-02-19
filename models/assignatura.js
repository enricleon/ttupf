/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var assignaturaSchema = mongoose.Schema({
    nom: 'string'
});

var Assignatura = mongoose.model('Assignatura', assignaturaSchema);

module.exports = Assignatura;