/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 15/02/13
 * Time: 20:29
 * To change this template use File | Settings | File Templates.
 */

var CarreraCurs = require('../models/grau');

/*
 * GET users listing.
 */

exports.test = function(req, res){
    var gei_c1_t2_g1 = new CarreraCurs({
        nom: "Grau en Enginyeria Informàtica Curs 1 Trimestre 1 Grup 1",
        url_horari: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GEI_C1_T2_G1.html",
        grup_teoria: "1",
        curs: "1",
        nom_carrera: "Grau en Enginyeria Informàtica"
    });

    gei_c1_t2_g1.save(function (err) {
        if (err) // ...
            console.log("no s'ha pogut guardar aquesta carreraCurs a mongo");
    });

    res.send("Se ha guardado con exito");
};

