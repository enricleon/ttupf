var passport = require('passport'),
    User = require('./models/User'),
    horari = require('./routes/horari'),
    user = require('./routes/user'),
    assignatures = require('./routes/assignatures'),
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index', { user : req.user, title: "Timetable UPF" });
    });

    app.get('/register', function(req, res) {
        res.render('register', { title: "Register" });
    });

    app.post('/register', function(req, res) {
        User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
            if (err) {
                return res.render('register', { user : user, title: "Register" });
            }
            req.login(user, function (error) {
                if (error) {
                    throw error;
                }
                res.redirect('/user/profile');
            });
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', { user : req.user, title: "Log In" });
    });

    app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/user/profile', failureRedirect: '/login' }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/api', ensureLoggedIn('/login'), function (req, res) {
        res.send('TTUPF API is running');
    });

    app.get('/horari', horari.init);
    app.get('/horari/actualitza', horari.actualitza);

    app.get('/user/profile', ensureLoggedIn('/login'), user.profile)

    app.get('/assignatures/actualitza', assignatures.actualitza);
};