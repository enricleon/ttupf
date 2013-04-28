/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 15/02/13
 * Time: 20:29
 * To change this template use File | Settings | File Templates.
 */

var CarreraCurs = require('../models/carreraCurs');
var Curs = require('../models/curs');
var Grau = require('../models/grau');
var Periode = require('../models/periode');

exports.actualitza = function(req, res) {
    res.render('index', { title: 'Actualitzant...' });

    CarreraCurs.find({}).populate('curs grau periode').exec(function (err, carreraCursos){
        // here you are iterating through the users
        // but you don't know when it will finish
        console.log(carreraCursos);
        carreraCursos.forEach(function(carreraCurs) {
            carreraCurs.actualitza();
        });
    });
}

exports.init = function(req, res){
    var periode_d = new Periode({
        trimestre: 2,
        any: new Date(2013)
    });

    var grau_d = new Grau({
        nom: "Grau en Enginyeria Informàtica",
        codi: "3377"
    });

    var curs_d = new Curs({
        nom: "Primer",
        numero: 1
    });

    grau_d.save(function(err) {
        if(err != null) {
            console.log(err.message)
        }
        else {
            console.log("OK");
        }
    });
    curs_d.save();
    periode_d.save();

    var gei_c1_t2_g1 = new CarreraCurs({
        url_horari: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GET_C2_T2_G1.html",
        grup_teoria: "1",
        grau: grau_d,
        periode: periode_d,
        curs: curs_d
    });

    gei_c1_t2_g1.save(function (err) {
        if (err) {
            console.log("Error: " + err.message);
        }
        else {
            res.send("Se ha guardado con exito");
        }
    });

    res.render('index', { title: 'CarreraCurs...' });
};

