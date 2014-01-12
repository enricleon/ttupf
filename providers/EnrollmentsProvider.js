var xpath = require('xpath'),
    dom = require('xmldom').DOMParser,
    async = require('async');

var User = require('../models/User');
var Subject = require('../models/Subject');
var Enrollment = require('../models/Enrollment');

var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var NameDistanceProvider = require('./NameDistanceProvider');

var EnrollmentsProvider = module.exports = function(user, callback) {
    this.user = user;
    this.enrollments = [];
    this.currentEnrollment = {};
    this.currentState = states.INITIAL;
    this.callback = callback;
};

var states = {
    INITIAL: 0,
    HAVE_SUBJECT: 1,
    HAVE_GROUP: 2
}

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

EnrollmentsProvider.prototype.Start = function(espaiaula) {
    var me = this;
    html2xhtml(espaiaula, function(err, html) {
        if(err)
        {
            throw err;
        }
        else {
            var doc = new dom().parseFromString(html);

            var lines = xpath.select("//html/body/descendant::tbody[@class = 'subtaula']//descendant::tr//td[@class = 'lletrab']/text()", doc);

            lines.reverse().forEach(function(line, index) {
                me.currentState = me.LineType(line);
                me.ProcessState(line);
            });

            me.FinishEnrollments();
        }
    });
};

EnrollmentsProvider.prototype.GetEnrolled = function(enrollment, subject, user, callback) {
    var upsert_data = {};

    upsert_data.practicum_group = "P101";
    upsert_data.seminar_group = "S101";

    if(enrollment.theory_group) {
        upsert_data.theory_group = enrollment.theory_group;

        if(enrollment.practicum_group) upsert_data.practicum_group = enrollment.practicum_group;
        else upsert_data.practicum_group = "P" + upsert_data.theory_group + "01";

        if(enrollment.seminar_group) upsert_data.seminar_group = enrollment.seminar_group;
        else upsert_data.seminar_group = "S" + upsert_data.theory_group + "01";
    }


    Enrollment.findOneAndUpdate({user: user, subject: subject}, upsert_data,{ upsert: true }, function(err, doc){
        if(err){
            callback(err);
        }
        else {
            callback(null, doc);
        }
    });
}

EnrollmentsProvider.prototype.FinishEnrollments = function() {
    var me = this;
    var calls = [];

    this.enrollments.forEach(function(enrollment, index) {
        calls.push(function(callback) {
            Subject.findOne({code: enrollment.subject_code}, function(err, subject_found) {
                if(err){
                    callback(err);
                }
                else {
                    if(subject_found) {
                        me.GetEnrolled(enrollment, subject_found, me.user, callback);
                    }
                    else {
                        NameDistanceProvider.DistanceDictionary(enrollment.subject_name, null, function(distance_dictionary) {
                            if(distance_dictionary) {
                                var lower_distance = NameDistanceProvider.LowerDistance(distance_dictionary);

                                if(lower_distance.distance < 0.60) {
                                    Subject.findOneAndUpdate({name: lower_distance.name}, {$addToSet: { code: enrollment.subject_code}}, { upsert: true }, function(err, subject_found){
                                        if(!err && subject_found){
                                            me.GetEnrolled(enrollment, subject_found, me.user, callback);
                                        }
                                        else {
                                            callback(err);
                                        }
                                    });
                                }
                                else {
                                    callback(null);
                                }
                            }
                            else {
                                callback(null);
                            }
                        });
                    }
                }
            });
        });
    });

    async.parallel(calls, me.callback);
};

EnrollmentsProvider.prototype.ProcessState = function(line) {
    var content = line.toString();
    content = content.replace(/(^\s*)|(\s*$)/gi,"");
    content = content.replace(/[ ]{2,}/gi," ");
    content = content.replace(/\n /,"\n");
    content = content.replace(/\n/,"");

    var line_decoded = content;

    if(this.currentState == states.HAVE_GROUP) {
        var groups_test = new RegExp("(.*?)([0-9]{1,10})[\\-]([0-9]{3})"); // If line matches at least one hour XX:XX hora =>3
        var result_group = line_decoded.match(groups_test);

        var type = result_group[1];
        var group = result_group[3];

        if(type.toLowerCase().indexOf('ctiques') > -1){
            this.currentEnrollment.practicum_group = "P" + group;
        }
        else if(type.toLowerCase().indexOf('sem') > -1){
            this.currentEnrollment.seminar_group = "S" + group;
        }
    }

    if(this.currentState == states.HAVE_SUBJECT) {
        var subject_test = new RegExp("([0-9]{1,10})[\\-]([0-9])\\s((?:(?:[ÀÁÇÈÉÍÏÒÓÚÜÑA-Z]?[àáçèéíïòóúüña-z\\'\\s\\.\\-·]+)+)+[ÀÁÈÉÍÏÒÓÚÜÑA-Z0-9]*)"); // If line matches at least one hour XX:XX hora =>3
        var result_subject = line_decoded.match(subject_test);
        var subject_code = result_subject[1];
        var theory_group = result_subject[2];
        var subject_name = result_subject[3];

        this.currentEnrollment.subject_code = subject_code;
        this.currentEnrollment.theory_group = theory_group;
        this.currentEnrollment.subject_name = subject_name;

        this.enrollments.push(this.currentEnrollment);
        this.currentEnrollment = {};
    }
}

EnrollmentsProvider.prototype.LineType = function(line) {
    var content = line.toString();
    content = content.replace(/(^\s*)|(\s*$)/gi,"");
    content = content.replace(/[ ]{2,}/gi," ");
    content = content.replace(/\n /,"\n");
    content = content.replace(/\n/,"");

    var line_decoded = content;

    var subject_test = new RegExp("([0-9]{1,10})[\\-]([0-9])\\s[A-Z]"); // If line matches at least one hour XX:XX hora =>3
    var groups_test = new RegExp("(.*?)([0-9]{1,10})[\\-]([0-9]{3})"); // If line matches at least one hour XX:XX hora =>3

    var result_subject = line_decoded.match(subject_test);
    var result_group = line_decoded.match(groups_test);

    if(result_group) {
        return states.HAVE_GROUP;
    }

    if(result_subject) {
        return states.HAVE_SUBJECT;
    }
}