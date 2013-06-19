/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var SubjectsProvider = require('../providers/SubjectsProvider');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Subject = new Schema({
    code:       {type: [String]},
    name:       {type: String, required: true, unique: true, index: true},
    course:     {type: ObjectId, ref: 'Course', required: true},
    sessions:   [{type: ObjectId, ref: 'Session'}]
});

var Subject = mongoose.model('Subject', Subject);

module.exports = Subject;