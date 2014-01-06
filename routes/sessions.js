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
    res.render('simpleMessage', { title: 'Actualització de la llista de sessions', message: "La llista de sessions s'està actualitzant..." });

    var query = {};
    if(req.query.url) {
        query.timetable_url = req.query.url;
    }
    GradeCourse.find(query).populate('course grade period').exec(function (err, gradePeriods){
        // here you are iterating through the users
        // but you don't know when it will finish
        console.log("Parsing sessions");
        gradePeriods.forEach(function(gradePeriod, index) {
            var progress = index * 100/gradePeriods.length;
            gradePeriod.progress = progress;
            console.log("    -- " + (index + 1) + ". Updating URL: " + gradePeriod.timetable_url);
            gradePeriod.update();
        });
    });
}

exports.index = function(req, res){
    req.user.HasEnrollments(function(err, has_enrollments) {
        if(!err && has_enrollments) {
            res.redirect('/sessions');
        }
        else {
            res.render("sessions/index", { title: 'Horari', user: req.user, message: "Sembla que no has matriculat assignatures o no tens l'horari configurat. Fes click <a href='/users/profile'>aquí</a> per a configurar el teu horari" });
        }
    });
};

exports.show = function(req, res){
    req.user.HasEnrollments(function(err, has_enrollments) {
        if(!err && has_enrollments) {
            var target_day = date.parse('today');

            if(req.params.day && req.params.month && req.params.year) {
                target_day = date.parse(req.params.day + "/" + req.params.month + "/" + req.params.year);
            }
            var user = req.user;

            Enrollment.GetSessionsByUserForDate(user, target_day, null, function(err, sessions) {
                sessions.sort(function(a,b){
                    var dateA = new Date(a.timestamp_start);
                    var dateB = new Date(b.timestamp_start);
                    return dateA > dateB;
                });
                res.render('sessions/index', {title: "Horari", user: req.user, date: target_day, sessions: sessions});
            });
        }
        else {
            res.redirect("/users/profile");
        }
    });
};

exports.config = function(req, res){
    var unis = req.body.unis;
    var password = req.body.password;

    var espaiAulaProvider = new EspaiAulaProvider(req.user);
    espaiAulaProvider.SynchroniseUPFProfile(unis, password, function(err, cosa) {
        res.redirect('/users/profile');
    });
};

