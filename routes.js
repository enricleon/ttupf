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
var timetable = require('./routes/timetable'),
    user = require('./routes/user'),
    subjects = require('./routes/subjects');


module.exports = function (app) {

    /**
     * Top level routes
     */

    // This renders the home page
    app.get('/', function (req, res) {
        res.render('index', { title: "Timetable University", user : req.user });
    });

    /**
     * User routes
     */

    // This renders the user profile
    app.get('/user', ensureLoggedIn('/login'), user.profile);

    // This is to edit a new user
    app.put('/user', ensureLoggedIn('/login'), user.edit);

    // This is to create a new user
    app.post('/user', user.new);

    // This renders the register form
    app.get('/user/new', function(req, res) {
        res.render('user/new_form', { title: "Crea un nou usuari" });
    });

    // This renders the edit user form
    app.get('/user/edit', ensureLoggedIn('/login'), function(req, res) {
        res.render('user/edit_form', { title: "Edita el teu perfil", user: req.user });
    });

    /**
     * Login routes
     */

    // This renders the login form
    app.get('/login', function(req, res) {
        res.render('user/login', { user : req.user, title: "Log In" });
    });

    // This is to put a user into the request if these is correct. If so, the user is redirected to his profile, either
    app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/user', failureRedirect: '/login' }));

    // This is to remove a user from the request and redirects to the home
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    /**
     * Parser trigger rotues
     */

    // This triggers the UPF timetable parser
    app.get('/timetable/update', timetable.update);

    // This updates the courses from the UPF program
    app.get('/subjects/update/', subjects.update);

    app.get('/timetable/test', function() {
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
    app.get('/timetable/config', ensureLoggedIn('/login'), timetable.config);

    // Timetable route is an authenticated route responsible to show the personal today's timetable to the user
    app.get('/timetable', ensureLoggedIn('/login'), timetable.init);

    // Timetable route/:date shows the personal daily timetable to the user on the specified date
    app.get('/timetable/:date', ensureLoggedIn('/login'), timetable.index);
};