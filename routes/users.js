/**
 * EspaiAulaProvider is to connect with UPF's EspaiAula and to provide user course's information. request package is to
 * make requests to external domains.
 */
var EspaiAulaProvider = require('../providers/EspaiAulaProvider');
var request = require('request');

var User = require('../models/User');

/**
 * GET This renders the user profile
 * @param res is the response the client is receiving.
 * @param req is the request sended by the client
 */
exports.profile = function(req, res){
    res.render('users/profile', {title: "Perfil d'usuari", user: req.user});
};

/**
 * POST This creates a new user profile
 * @param res is the response the client is receiving.
 * @param req is the request sended by the client
 */
exports.new = function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            res.redirect('/users/new');
        }
        req.login(user, function (error) {
            if (error) {
                throw error;
            }
            res.redirect('/users');
        });
    });
}

/**
 * PUT This modifies the request's user with the sended parameters.
 * @param res is the response the client is receiving.
 * @param req is the request sended by the client
 */
exports.edit = function(res, req) {
    var current_user = req.user;
    // Do things with req.body.things
    if(false) {
        current_user.save(function(err) {
            if(err) {
                res.redirect('/users/edit');
            }
            else {
                res.redirect('/users');
            }
        });
    }
}