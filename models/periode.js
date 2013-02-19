/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var periodeSchema = mongoose.Schema({
    trimestre:  {type: Number, required: true},
    any:        {type: Date, required: true}
});

var Periode = mongoose.model('Periode', periodeSchema);

module.exports = Periode;