/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 15/02/13
 * Time: 20:29
 * To change this template use File | Settings | File Templates.
 */

var Session = require("../models/Session");
var date = require('../public/js/date');
var EspaiAulaProvider = require('../providers/EspaiAulaProvider');

/*
 * GET This renders the timetable index
 */
exports.GetAllSessions = function(req, res){
    var current_date = new Date();

    var next_day = new Date();
    next_day.setDate(current_date.getDate() + 1);

    Session.find({timestamp_start: {$gte: current_date, $lt: next_day}}, function(err, docs) {
        if(!err && docs) {
            res.send(JSON.stringify(docs));
        }
    });
};

/*
 * GET This executes the configurator
 */
exports.GetSessionsByDate = function(req, res){
    var current_date = new Date(req.params.date);

    var next_day = new Date();
    next_day.setDate(current_date.getDate() + 1);

    Session.find({timestamp_start: {$gte: current_date, $lt: next_day}}, function(err, docs) {
        if(!err && docs) {
            res.send(JSON.stringify(docs));
        }
    });
};

exports.Config = function(req, res){
    var unis = req.body.unis;
    var password = req.body.password;

    var espaiAulaProvider = new EspaiAulaProvider(req.user);
    espaiAulaProvider.SynchroniseUPFProfile(unis, password, function(err) {
        if(!err) {
            res.send({response: "ok"});
        }
        else {
            res.send({response: "ko", error: err});
        }
    });
};