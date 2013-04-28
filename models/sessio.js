/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Sessio = new Schema({
    tipus:          {type: String},
    grup:           {type: String},
    aula:           {type: String},
    data:           {type: Date, required: true},
    comentari:      {type: String}
});

Sessio.index({ aula: 1, data: 1 }, { unique: true });

var Sessio = mongoose.model('Sessio', Sessio);

module.exports = Sessio;