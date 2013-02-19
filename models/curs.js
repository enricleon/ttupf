/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var cursSchema = mongoose.Schema({
    nom: 'string'
});

var Curs = mongoose.model('Curs', cursSchema);

module.exports = Curs;