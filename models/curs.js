/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Curs = new Schema({
    nom:    {type: String, required: true, unique: true},
    numero: {type: String, required: true, unique: true, index: true}
});

var Curs = mongoose.model('Curs', Curs);

module.exports = Curs;