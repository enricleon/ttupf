/**
 * External Libraries
 */
var restify = require('express-restify-mongoose'),
    oauth2 = require('./providers/Oauth2');

/**
 * Model Libraries
 */
var SessionModel = require('./models/Session'),
    UserModel = require('./models/User'),
    SubjectModel = require('./models/Subject'),
    EnrollmentModel = require('./models/Enrollment'),
    GradeModel = require('./models/Grade'),
    CourseModel = require('./models/Course'),
    PeriodModel = require('./models/Period'),
    QuarterModel = require('./models/Quarter'),
    GradeCourseModel = require('./models/GradeCourse.js');

var AccessToken = require('./models/AccessToken');

/**
 * Routes
 */


module.exports = function (app, passport) {

    /**
     * Oauth2 routes
     */
    app.get('/dialog/authorize', oauth2.authorization);
    app.post('/dialog/authorize/decision', oauth2.decision);
    app.post('/oauth/token', oauth2.token);

    /**
     * User routes
     */
    restify.serve(app, UserModel, { middleware: [passport.authenticate('bearer', { session: false })]});

    /**
     * Timetable routes
     */
    restify.serve(app, SessionModel);

    /**
     * Enrollment routes
     */
    restify.serve(app, EnrollmentModel);

    /**
     * Subjects routes
     */
    restify.serve(app, SubjectModel);

};
