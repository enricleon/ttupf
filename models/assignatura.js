/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var AssignaturesProvider = require('../providers/AssignaturesProvider');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Assignatura = new Schema({
    codi:       {type: [String], required: true},
    nom:        {type: String, required: true, unique: true, index: true},
    curs:       {type: ObjectId, ref: 'Curs', required: true},
    sessions:   {type: [ObjectId], ref: 'Sessio'}
});


//TODO
Assignatura.methods.actualitza = function(codi_grau) {
    var assignaturesProvider = new AssignaturesProvider(codi_grau);

    var me = this;

    assignaturesProvider.FindCodiAssignaturaByName(function(codi_assignatura) {
        me.codi.push(codi_assignatura);
        me.save();
    }, this.nom);
};

var Assignatura = mongoose.model('Assignatura', Assignatura);

module.exports = Assignatura;