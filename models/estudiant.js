/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var estudiantSchema = mongoose.Schema({
    nom:        {type: String},
    nia:        {type: String},
    password:   {type: String},
    email:      {type: String}
});

var Estudiant = mongoose.model('Estudiant', estudiantSchema);

module.exports = Estudiant;