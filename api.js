/**
 * External Libraries
 */
/* Passport is required to manage all the user authentication in the system. Conect-ensure-login is required to grant
 user acces on sensible pages */
var passport = require('passport'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

/**
 * Model Libraries
 */


/**
 * Routes
 */
var session = require('./api/session'),
    user = require('./api/user');

module.exports = function (app) {
    /**
     * User routes
     */
    app.get('/api/user/:username', user.profile);
    app.post('/api/user/:username', user.new);
    app.put('/api/user/:username', user.edit);

    /**
     * Timetable routes
     */
    app.get('/api/sessions', session.GetAllSessions);
    app.get('/api/sessions/:date', session.GetSessionsByDate);
};
