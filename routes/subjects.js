/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 2/05/13
 * Time: 19:14
 * To change this template use File | Settings | File Templates.
     */

var Grade = require('../models/Grade');
var Subject = require('../models/Subject');
var SubjectsProvider = require('../providers/SubjectsProvider');

var ObjectId = require('mongoose').Types.ObjectId;

exports.update = function (req, res) {
    // Per cada subject a la base de dades
    // subject.update();
    //per cada grade, aga
    res.render('simpleMessage', { title: 'Actualització de la llista de asignatures', message: "La llista de subjects s'està actualitzant..." });

    Grade.find({}).exec(function (err, grades){
        var subjectsProvider = new SubjectsProvider();
        grades.forEach(function(grade){
            subjectsProvider.UpdateAllSubjects(grade.code);
        });
    });
}

exports.removeOne = function(req, res) {
    res.render('simpleMessage', { title: 'Removing subject', message: "Esborrant l'assignatura..." });
    Subject.findOne({_id: ObjectId(req.query._id)}, function(err, doc) {
        doc.remove();
    });
}