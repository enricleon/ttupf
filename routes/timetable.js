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
    var period_d = new Period({
        quarter: 2,
        year: new Date(2013)
    });

    var grade_d = new Grade({
        name: "Grade en Enginyeria Informàtica",
        code: "3377"
    });

    var curs_d = new Course({
        name: "Primer",
        number: 1
    });

    grade_d.save(function(err) {
        if(err != null) {
            console.log(err.message)
        }
        else {
            console.log("OK");
        }
    });
    curs_d.save();
    period_d.save();

    var gei_c1_t2_g1 = new GradeCourse({
        timetable_url: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GET_C2_T2_G1.html",
        theory_group: "1",
        grade: grade_d,
        period: period_d,
        course: curs_d
    });

    gei_c1_t2_g1.save(function (err) {
        if (err) {
            console.log("Error: " + err.message);
        }
        else {
            res.send("Se ha guardado con exito");
        }
    });

    res.render('index', { title: 'GradeCourse...' });
};

exports.index = function(req, res){
    res.render('timetable/index', {title: "Index de l'horari", user: req.user})
};

exports.config = function(req, res){
    res.render('timetable/index', {title: "Configurant l'horari...", user: req.user})

    var espaiAulaProvider = new EspaiAulaProvider(req.user);
    espaiAulaProvider.SynchroniseUPFProfile("u56059", "09101988");
};

