/**
 * External Libraries
 */
/* Passport is required to manage all the user authentication in the system. Conect-ensure-login is required to grant
   user access on sensible pages */
var passport = require('passport'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var basicAuth = require('express').basicAuth;

var Block = require('./providers/Block');
var SessionsProvider = require('./providers/SessionsProvider');
var Date = require('./public/js/date.js');

/**
 * Model Libraries
 */
var User = require('./models/User');

/**
 * Routes
 */
var sessions = require('./routes/sessions'),
    users = require('./routes/users'),
    subjects = require('./routes/subjects');

module.exports = function (app) {

    /**
     * Top level routes
     */

    // This renders the home page
    app.get('/index', function (req, res) {
        res.render('index', { title: "Timetable UPF", user : req.user });
    });

    // This renders the home page
    app.get('/', function (req, res) {
        if(req.user) {
            res.redirect('/users/profile');
        }
        else {
            res.redirect('/index');
        }
    });

    /**
     * User routes
     */

    // This renders the user profile
    app.get('/users/profile', ensureLoggedIn('/login'), users.profile);

    app.get('/users', ensureLoggedIn('/login'), sessions.index);

    // This is to edit a new user
    app.put('/users', ensureLoggedIn('/login'), users.edit);

    // This is to create a new user
    app.post('/users', users.new);

    // This renders the register form
    app.get('/users/new', function(req, res) {
        res.render('users/new_form', { title: "Crea un nou usuari" });
    });

    // This renders the edit user form
    app.get('/users/edit', ensureLoggedIn('/login'), function(req, res) {
        res.render('users/edit_form', { title: "Edita el teu perfil", user: req.user });
    });

    /**
     * Login routes
     */

    // This renders the login form
    app.get('/login', function(req, res) {
        res.render('users/login', { user : req.user, title: "Log In" });
    });

    // This is to put a user into the request if these is correct. If so, the user is redirected to his profile, either
    app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/sessions', failureRedirect: '/login' }));

    // This is to remove a user from the request and redirects to the home
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /**
     * Parser trigger rotues
     */

    // Timetable route is an authenticated route responsible to show the personal today's timetable to the user
    app.get('/sessions', ensureLoggedIn('/login'), sessions.show);

    // Timetable route is an authenticated route responsible to show the personal today's timetable to the user
    app.get('/sessions/index', ensureLoggedIn('/login'), sessions.index);

    // Timetable route/:date shows the personal daily timetable to the user on the specified date
    app.get('/sessions/:day/:month/:year', ensureLoggedIn('/login'), sessions.show);

    var auth = function(req, res, next) {
        basicAuth(function(user, pass, callback) {
            callback(null, user === 'ttupfadmin' && pass === 'ttupf13jef');
        })(req, res, next);
    };

    app.get('/subjects/update', auth, subjects.update);

    // This triggers the UPF timetable parser
    app.get('/sessions/update', auth, sessions.update);

    /**
     * Timetable routes
     */

    // Timetable route is an authenticated route responsible to show the personal today's timetable to the user
    app.post('/users/config', ensureLoggedIn('/login'), sessions.config);
};