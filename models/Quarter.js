/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Quarter = new Schema({
    period:        {type: ObjectId, ref: 'Period', required: true},
    subject:    {type: ObjectId, ref: 'Subject', required: true}
});

var Quarter = mongoose.model('Quarter', Quarter);

module.exports = Quarter;