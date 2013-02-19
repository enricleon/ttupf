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


/*
 * GET users listing.
 */

exports.test = function(req, res){

    var gei_c1_t2_g1 = new CarreraCurs({
        url_horari: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GEI_C1_T2_G1.html"
    });

    gei_c1_t2_g1.save(function (err) {
        if (err)
            console.log("no s'ha pogut guardar aquesta carreraCurs a mongo");
        else
            res.send("Se ha guardado con exito");

        var periode_d = new Periode({
            trimestre: 2,
            any: new Date(2013)
        }),
        grau_d = new Grau({
            nom: "Grau en Enginyeria Informàtica"
        }),
        curs_d = new Curs({
            nom: "Primer"
        })

        this.grau = grau_d;
        this.periode = periode_d;
        this.curs = curs_d;

        grau_d.save();
        curs_d.save();
        periode_d.save();
    });

    gei_c1_t2_g1.getAssignatures();

};

