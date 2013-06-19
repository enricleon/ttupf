/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Grade = new Schema({
    name:        {type: String, required: true},
    code:       {type: String, required: true, unique: true},
    subjects: [{type: ObjectId, ref: 'Subject'}]
});

var Grade = mongoose.model('Grade', Grade);

module.exports = Grade;