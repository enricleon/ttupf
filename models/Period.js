/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Period = new Schema({
    quarter:  {type: Number, required: true},
    year:        {type: Date, required: true}
});

Period.index({ quarter: 1, year: 1 }, { unique: true });

var Periode = mongoose.model('Period', Period);

module.exports = Periode;