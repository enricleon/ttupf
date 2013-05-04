
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    horari = require('./routes/horari'),
    assignatures = require('./routes/assignatures');

mongoose.connect('localhost', 'ttupf');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

app.get('/api', function (req, res) {
    res.send('TTUPF API is running');
});

app.get('/horari', horari.init);
app.get('/horari/actualitza', horari.actualitza);

app.get('/assignatures/actualitza', assignatures.actualitza);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
