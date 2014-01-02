
/**
 * Module dependencies.
 */

    var express = require('express'),
        mongoose = require('mongoose'),
        http = require('http'),
        path = require('path'),
        passport = require('passport'),
        Config = require('./config'),
        LocalStrategy = require('passport-local').Strategy,
        BearerStrategy = require('passport-http-bearer').Strategy,
        BasicStrategy = require('passport-http').BasicStrategy,
        ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;

    var AccessToken = require("./models/AccessToken");

    var app = express();

    // Configuration
    app.configure(function(){
        app.set('port', process.env.PORT || 3000);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'vash');
        app.set('view options', { layout: false });

        app.use(express.logger());
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.cookieParser('keyboard cat'));
        app.use(express.session({ secret: 'keyboard cat' }));

        app.use(passport.initialize());
        app.use(passport.session());
        require('./api')(app, passport);

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
    var Client = require('./models/Client');

    /**
     * BasicStrategy & ClientPasswordStrategy
     *
     * These strategies are used to authenticate registered OAuth clients.  They are
     * employed to protect the `token` endpoint, which consumers use to obtain
     * access tokens.  The OAuth 2.0 specification suggests that clients use the
     * HTTP Basic scheme to authenticate.  Use of the client password strategy
     * allows clients to send the same credentials in the request body (as opposed
     * to the `Authorization` header).  While this approach is not recommended by
     * the specification, in practice it is quite common.
     */
    passport.use(new BasicStrategy(
        function(username, password, done) {
            Client.findOne({client_id: username}).exec(function(err, client) {
                if (err) { return done(err); }
                if (!client) { return done(null, false); }
                if (client.client_secret != password) { return done(null, false); }
                return done(null, client);
            });
        }
    ));

    passport.use(new ClientPasswordStrategy(
        function(client_id, client_secret, done) {
            Client.findOne({client_id: client_id}).exec(function(err, client) {
                if (err) { return done(err); }
                if (!client) { return done(null, false); }
                if (client.client_secret != client_secret) { return done(null, false); }
                return done(null, client);
            });
        }
    ));

    /**
     * BearerStrategy
     *
     * This strategy is used to authenticate users based on an access token (aka a
     * bearer token).  The user must have previously authorized a client
     * application, which is issued an access token to make requests on behalf of
     * the authorizing user.
     */
    passport.use(new BearerStrategy(
        function(access_token, done) {
            AccessToken.findOne({token: access_token}).populate("user").exec(function(err, token) {
                if (err) { return done(err); }
                if (!token) { return done(null, false); }

                User.findOne({username: token.user.username}).exec(function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    // to keep this example simple, restricted scopes are not implemented,
                    // and this is just for illustrative purposes
                    var info = { scope: 'own_relations' };
                    done(null, user, info);
                });
            });
        }
    ));

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

//    var uristring = 'mongodb://admintest:L_1i2o9n2@ds045938.mongolab.com:45938' || process.env.MONGOLAB_URI || 'localhost:27017';

    // Connect mongoose
//    mongoose.connect('mongodb://ttupf_mongolab:L_1i2o9n2@ds027748.mongolab.com:27748/ttupf_mongolab');
    mongoose.connect('localhost:27017/ttupf');

    // Setup routes
    require('./routes')(app);

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
