/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Periode = new Schema({
    trimestre:  {type: Number, required: true},
    any:        {type: Date, required: true}
});

Periode.index({ trimestre: 1, any: 1 }, { unique: true });

var Periode = mongoose.model('Periode', Periode);

module.exports = Periode;