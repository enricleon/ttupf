/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 11:30
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Course = new Schema({
    name:    {type: String, required: true, unique: true},
    number: {type: String, required: true, unique: true, index: true}
});

var Course = mongoose.model('Course', Course);

module.exports = Course;