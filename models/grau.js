/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Grau = new Schema({
    nom:        {type: String, required: true},
    codi:       {type: String, required: true, unique: true},
    web_estudi: {type: String}
});

var Grau = mongoose.model('Grau', Grau);

module.exports = Grau;