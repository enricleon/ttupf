
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    Config = require('./config'),
    LocalStrategy = require('passport-local').Strategy;

var app = express();

// Configuration
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });

    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({ secret: 'keyboard cat' }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

var User = require('./models/User');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect mongoose
mongoose.connect('localhost', 'ttupf');

// Setup routes
require('./routes')(app);
require('./api')(app);

// We read the Configuration file:
fs = require('fs');
fs.readFile('./config/Configuration.xml', 'utf8', function (err,data) {
    if (err) {
        console.log(err);
    }
    var config = new Config();
    config.LoadConfig(data);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
