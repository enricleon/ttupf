var xpath = require('xpath'),
    dom = require('xmldom').DOMParser,
    tidy = require('htmltidy').tidy;

var User = require('../models/User');
var Subject = require('../models/Subject');
var Enrollment = require('../models/Enrollment');

var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var NameDistanceProvider = require('./NameDistanceProvider');

var EnrollmentsProvider = module.exports = function(user) {
    this.user = user;
    this.enrollments = [];
    this.currentEnrollment = {};
    this.currentState = states.INITIAL;
};

var states = {
    INITIAL: 0,
    HAVE_SUBJECT: 1,
    HAVE_GROUP: 2
}

EnrollmentsProvider.prototype.Start = function(espaiaula) {
    var me = this;
    tidy(espaiaula, function(err, html) {
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

EnrollmentsProvider.prototype.FinishEnrollments = function() {
    var user = this.user;

    this.enrollments.forEach(function(item, index) {
        Subject.findOne({code: item.subject_code}, function(err, doc) {
            if(!err){
                if(doc) {
                    var upsert_data = {};

                    if(item.seminar_group) upsert_data.seminar_group = item.seminar_group;
                    if(item.theory_group) upsert_data.theory_group = item.theory_group;
                    if(item.practicum_group) upsert_data.practicum_group = item.practicum_group;
                    else upsert_data.practicum_group = "P101";

                    Enrollment.findOneAndUpdate({user: user, subject: doc}, upsert_data,{ upsert: true }, function(err, doc){
                        if(err){
                            console.log(err);
                        }
                        else {
                            console.log("Enrollment updated or created successfully!");
                        }
                    });
                }
                else {
                    NameDistanceProvider.DistanceDictionary(item.subject_name, null, function(distance_dictionary) {
                        var lower_distance = NameDistanceProvider.LowerDistance(distance_dictionary);

                        if(lower_distance.distance < 3) {
                            Subject.findOneAndUpdate({name: lower_distance.name}, {$addToSet: { code: item.subject_code}}, { upsert: true }, function(err, subject_doc){
                                if(!err && subject_doc){
                                    var upsert_data = {};

                                    if(item.seminar_group) upsert_data.seminar_group = item.seminar_group;
                                    if(item.theory_group) upsert_data.theory_group = item.theory_group;
                                    if(item.practicum_group) upsert_data.practicum_group = item.practicum_group;
                                    else upsert_data.practicum_group = "P101";

                                    Enrollment.findOneAndUpdate({user: user, subject: subject_doc}, upsert_data,{ upsert: true }, function(err, enrollment_doc){
                                        if(err){
                                            console.log(err);
                                        }
                                        else {
                                            console.log("Enrollment updated or created successfully!");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    });
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