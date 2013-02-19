/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var sessioSchema = mongoose.Schema({
    tipus:          {type: String},
    grup:           {type: String},
    aula:           {type: String},
    comentari:      {type: String},
    periode:        {type: mongoose.Schema.ObjectId, ref: 'Periode', required: true},
    assignatura:    {type: mongoose.Schema.ObjectId, ref: 'Assignatura', required: true}
});

var Sessio = mongoose.model('Sessio', sessioSchema);

module.exports = Sessio;