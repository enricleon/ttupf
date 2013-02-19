/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var grauSchema = mongoose.Schema({
    nom: 'string',
    web_estudi: 'string'
});

var Grau = mongoose.model('Grau', grauSchema);

module.exports = Grau;