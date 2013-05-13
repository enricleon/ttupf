/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 2/05/13
 * Time: 19:14
 * To change this template use File | Settings | File Templates.
     */

var Grau = require('../models/Grade');
var Assignatura = require('../models/Subject');

var ObjectId = require('mongoose').Types.ObjectId;

exports.update = function (req, res) {
    // Per cada subject a la base de dades
    // subject.update();
    //per cada grade, aga
    res.render('simpleMessage', { title: 'Actualització de la llista de asignatures', message: "La llista de subjects s'està actualitzant..." });

    Grau.find({}).exec(function (err, graus){
        // here you are iterating through the users
        // but you don't know when it will finish
        if(err){
            console.log(err);
        } else{
            graus.forEach(function(grau){

                var codi = grau.code;
                grau.subjects.forEach(function (assignatura){

                    Assignatura.findById(new ObjectId(assignatura.id), function(err, assignatura) {
                        assignatura.actualitza(codi_grau);
                    });
                });
            });
        }
    });
}

