var passport = require('passport'),
    User = require('./models/User'),
    horari = require('./routes/horari'),
    assignatures = require('./routes/assignatures');

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
                res.redirect('/');
            });
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', { user : req.user, title: "Log In" });
    });

    app.post('/login', passport.authenticate('local', { successRedirect: '/',
        failureRedirect: '/login' }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/api', function (req, res) {
        res.send('TTUPF API is running');
    });

    app.get('/horari', horari.init);
    app.get('/horari/actualitza', horari.actualitza);

    app.get('/assignatures/actualitza', assignatures.actualitza);
};