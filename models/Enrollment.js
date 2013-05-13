/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Enrollment = new Schema({
    theory_group:        {type: String},
    practicum_group:    {type: String},
    seminar_group:      {type: String},
    user:          {type: ObjectId, ref: 'User', required: true},
    subject:        {type: ObjectId, ref: 'Subject', required: true}
});

var Enrollment = mongoose.model('Enrollment', Enrollment);

module.exports = Enrollment;