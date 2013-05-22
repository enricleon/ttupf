/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    xpath = require('xpath'),
    querystring = require('querystring'),
    http = require('http'),
    timetableApi = require('../providers/TimetableProvider'),
    tidy = require('htmltidy').tidy;

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var GradeCourse = new Schema({
    timetable_url:     {type: String, required: true, unique: true, index: true},
    theory_group:    {type: String, required: true},
    grade:           {type: ObjectId, ref: 'Grade', required: true},
    course:           {type: ObjectId, ref: 'Course', required: true},
    period:        {type: ObjectId, ref: 'Period', required: true}
});

GradeCourse.methods.update = function(body){
    if (body != undefined) {
        tidy(body, function(err, html) {
            timetableApi.ParseGradeCourse(html);
        });
    } else {
        timetableApi.GetHtmlFrom(this);
    }
};

var GradeCourse = mongoose.model('GradeCourse', GradeCourse);

module.exports = GradeCourse;