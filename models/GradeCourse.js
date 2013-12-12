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
    timetableApi = require('../providers/TimetableProvider');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

function html2xhtml(post_data, callback){
    var request = require('request');
    request.post({
        headers: {'content-type' : 'text/html'},
        url:     'http://www.it.uc3m.es/jaf/cgi-bin/html2xhtml.cgi',
        body:    post_data
    }, function(error, response, body){
        callback(error, body);
    });
}

var GradeCourse = new Schema({
    timetable_url:     {type: String, required: true, unique: true, index: true},
    theory_group:    {type: String, required: true},
    grade:           {type: ObjectId, ref: 'Grade', required: true},
    course:           {type: ObjectId, ref: 'Course', required: true},
    period:        {type: ObjectId, ref: 'Period', required: true}
});

GradeCourse.methods.update = function(body){
    if (body != undefined) {
        html2xhtml(body, function(err, html) {
            if(err) { console.log(err); }else {
                timetableApi.ParseGradeCourse(html);
            }
        });
    } else {
        timetableApi.GetHtmlFrom(this);
    }
};

var GradeCourse = mongoose.model('GradeCourse', GradeCourse);

module.exports = GradeCourse;