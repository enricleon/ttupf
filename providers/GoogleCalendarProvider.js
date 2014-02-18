var ical = require('ical-generator');
var moment = require('moment-timezone');
var Enrollment = require('../models/Enrollment');

var GoogleCalendarProvider = module.exports = function(user) {
    this.currentUser = user;
    this.cal = ical();
};

GoogleCalendarProvider.prototype.fillCalendar = function(callback) {
    moment().tz("Europe/Amsterdam").format();
    var user = this.currentUser;
    var cal = this.cal;

    Enrollment.GetSessionsByUser(user, null, function(err, sessions) {
        for(var i = 0; i < sessions.length; i++) {
            var session = sessions[i];

            var start = moment.tz(session.timestamp_start, "UTC").tz("Europe/Amsterdam");


            var end = new Date(session.timestamp_start.getTime());
            end.setHours(end.getHours() + 2);

            if(session.timestamp_end) {
                end = new Date(session.timestamp_end.getTime());
            }

            var end = moment.tz(end, "UTC").tz("Europe/Amsterdam");

            var final_start = new Date(start.format("YYYY"), start.format("MM") - 1, start.format("DD"), start.format("HH"), start.format("mm"));
            var final_end = new Date(end.format("YYYY"), end.format("MM") - 1, end.format("DD"), end.format("HH"), end.format("mm"));

			var session_name = session.subject && session.subject.name ? session.subject.name : "Unknown Subject";

            cal.addEvent({
                start: final_start,
                end: final_end,
                summary: session_name + ": " + session.type + " " + session.classroom,
                description: session.comment,
                location: session.classroom
            });
        }
        callback(cal);
    });
};