/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 15/02/13
 * Time: 20:29
 * To change this template use File | Settings | File Templates.
 */

var GradeCourse = require('../models/GradeCourse');
var Course = require('../models/Course');
var Grade = require('../models/Grade');
var Period = require('../models/Period');

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

exports.init = function(req, res){
    res.render('timetable/index', { title: 'Timetable initialization...' });
};

exports.index = function(req, res){
    res.render('timetable/index', {title: "Index de l'horari", user: req.user})
};

exports.config = function(req, res){
    res.render('timetable/index', {title: "Configurant l'horari...", user: req.user})

    var espaiAulaProvider = new EspaiAulaProvider(req.user);
    //espaiAulaProvider.SynchroniseUPFProfile("u56059", "09101988");
    //espaiAulaProvider.SynchroniseUPFProfile("u64379", "659446033");
    espaiAulaProvider.SynchroniseUPFProfile("u56094", "ttupfttupf1");
};

