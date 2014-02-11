var ical = require('ical-generator');
var Enrollment = require('../models/Enrollment');

var GoogleCalendarProvider = module.exports = function(user) {
    this.currentUser = user;
    this.cal = ical();
};

GoogleCalendarProvider.prototype.fillCalendar = function(callback) {
    var user = this.currentUser;
    var cal = this.cal;

    Enrollment.GetSessionsByUser(user, null, function(err, sessions) {
        for(var i = 0; i < sessions.length; i++) {
            var session = sessions[i];

            var end = new Date(session.timestamp_start.getTime());
            end.setHours(end.getHours() + 2);

            cal.addEvent({
                start: session.timestamp_start,
                end: session.timestamp_end || end,
                summary: session.subject,
                description: session.type,
                location: session.classroom
            });
        }
        callback(cal);
    });
};