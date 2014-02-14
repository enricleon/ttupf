var ical = require('ical-generator');
var time = require('time');
var Enrollment = require('../models/Enrollment');

var GoogleCalendarProvider = module.exports = function(user) {
    this.currentUser = user;
    this.cal = ical();
};

GoogleCalendarProvider.prototype.fillCalendar = function(callback) {
    time.tzset('Europe/Amsterdam');
    var user = this.currentUser;
    var cal = this.cal;

    Enrollment.GetSessionsByUser(user, null, function(err, sessions) {
        for(var i = 0; i < sessions.length; i++) {
            var session = sessions[i];

            var end = new time.Date(session.timestamp_start.getTime());
            end.setHours(end.getHours() + 2);

			var session_name = session.subject && session.subject.name ? session.subject.name : "Unknown Subject";

            cal.addEvent({
                start: session.timestamp_start,
                end: session.timestamp_end || end,
                summary: session_name + ": " + session.type + " " + session.classroom,
                description: session.comment,
                location: session.classroom
            });
        }
        callback(cal);
    });
};