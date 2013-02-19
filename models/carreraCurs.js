/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var carreraCursSchema = mongoose.Schema({
    url_horari: {type: String, required: true},
    grau:       {type: mongoose.Schema.ObjectId, ref: 'Grau', required: true},
    curs:       {type: mongoose.Schema.ObjectId, ref: 'Curs', required: true},
    periode:    {type: mongoose.Schema.ObjectId, ref: 'Periode', required: true}
});

var CarreraCurs = mongoose.model('CarreraCurs', carreraCursSchema);

module.exports = CarreraCurs;