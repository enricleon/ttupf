/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Session = new Schema({
    type:               {type: String},
    group:              {type: String},
    classroom:          {type: String},
    timestamp_start:    {type: Date, required: true},
    timestamp_end:      {type: Date, required: true},
    comment:            {type: String}
});

Session.index({ classroom: 1, timestamp_start: 1 }, { unique: true });

var Session = mongoose.model('Session', Session);

module.exports = Session;