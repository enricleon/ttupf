/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 2/05/13
 * Time: 19:14
 * To change this template use File | Settings | File Templates.
     */

var Grau = require('../models/Grau');
var Assignatura = require('../models/Assignatura');

var ObjectId = require('mongoose').Types.ObjectId;

exports.actualitza = function (req, res) {
    // Per cada assignatura a la base de dades
    // assignatura.actualitza();
    //per cada grau, aga
    res.render('simpleMessage', { title: 'Actualització de la llista de asignatures', message: "La llista de assignatures s'està actualitzant..." });

    Grau.find({}).exec(function (err, graus){
        // here you are iterating through the users
        // but you don't know when it will finish
        if(err){
            console.log(err);
        } else{
            graus.forEach(function(grau){
                var codi = grau.codi;
                grau.assignatures.forEach(function (assignatura){
                    Assignatura.findById(new ObjectId(assignatura.id), function(err, assig) {
                        console.log(assig);
                    });
                });
            });
        }
    });
}