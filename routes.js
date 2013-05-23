/**
 * External Libraries
 */
/* Passport is required to manage all the user authentication in the system. Conect-ensure-login is required to grant
   user access on sensible pages */
var passport = require('passport'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

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
        res.render('index', { title: "Timetable University", user : req.user });
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

    // This triggers the UPF timetable parser
    app.get('/sessions/update', sessions.update);

    // This updates the courses from the UPF program
    app.get('/subjects/update/', subjects.update);

    app.get('/sessions/test', function() {
        var html = '<td id="cela_15"><div align="center">Sistemes Operatius <br><b>SEMINARI</b><br>S102: 52.329<br><b>PRÀCTIQUES</b><br>P102: 54.004<br></div></td>';
        var date = Date.parse("11/01/2013 18:30");

        var blockToTest = new Block(html, date);

        blockToTest.Finish = function(topic) {
            console.log(topic);
        };

        var sessionsProvider = new SessionsProvider();
        sessionsProvider.ParseBlock(blockToTest);
    })

    /**
     * Timetable routes
     */

    // Timetable route is an authenticated route responsible to show the personal today's timetable to the user
    app.post('/users/config', ensureLoggedIn('/login'), sessions.config);

    // Timetable route is an authenticated route responsible to show the personal today's timetable to the user
    app.get('/sessions', ensureLoggedIn('/login'), sessions.index);

    // Timetable route/:date shows the personal daily timetable to the user on the specified date
    app.get('/sessions/:day/:month/:year', ensureLoggedIn('/login'), sessions.index);
};