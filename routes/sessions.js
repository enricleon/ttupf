/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 15/02/13
 * Time: 20:29
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

var GradeCourse = require('../models/GradeCourse');
var Course = require('../models/Course');
var Grade = require('../models/Grade');
var Period = require('../models/Period');
var Enrollment = require('../models/Enrollment');

var date = require('../public/js/date');

var EspaiAulaProvider = require('../providers/EspaiAulaProvider');

exports.update = function(req, res) {
    res.render('simpleMessage', { title: 'Acctualització de la llista de sessions', message: "La llista de sessions s'està actualitzant..." });

    GradeCourse.find({}).populate('course grade period').exec(function (err, gradePeriods){
        // here you are iterating through the users
        // but you don't know when it will finish
        console.log(gradePeriods);
        gradePeriods.forEach(function(gradePeriod) {
            gradePeriod.update();
        });
    });
}

exports.index = function(req, res){
    var target_day = date.parse('today');

    if(req.params.day && req.params.month && req.params.year) {
        target_day = date.parse(req.params.day + "/" + req.params.month + "/" + req.params.year);
    }
    var user = req.user;

    Enrollment.GetSessionsByUserForDate(user, target_day, null, function(err, sessions) {
        res.render('sessions/index', {title: "Horari", user: req.user, date: target_day, sessions: sessions});
    });
};

exports.config = function(req, res){
    res.render('simpleMessage', {title: "Configurant l'horari...", message: "En breus instants ja podrà consulatar el seu horari.", user: req.user});

    var nia = req.body.nia;
    var password = req.body.password;

    var espaiAulaProvider = new EspaiAulaProvider(req.user);
    espaiAulaProvider.SynchroniseUPFProfile(nia, password);
};
