/**
 * External Libraries
 */
/* Passport is required to manage all the user authentication in the system. Conect-ensure-login is required to grant
 user acces on sensible pages */
var passport = require('passport'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
    enrollments = require('./api/enrollments');

/**
 * Model Libraries
 */


/**
 * Routes
 */
var session = require('./api/sessions'),
    user = require('./api/users');

module.exports = function (app) {
    /**
     * User routes
     */
    app.get('/api/users/:username', user.profile);
    app.post('/api/users/:username', user.new);
    app.put('/api/users/:username', user.edit);

    /**
     * Timetable routes
     */
    app.get('/api/sessions', session.GetAllSessions);
    app.get('/api/sessions/:date', session.GetSessionsByDate);

    /**
     * Enrollment routes
     */
    app.put('/api/enrollments', enrollments.edit);
};
