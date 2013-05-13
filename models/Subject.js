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

var Subject = new Schema({
    code:       {type: [String]},
    name:       {type: String, required: true, unique: true, index: true},
    course:     {type: ObjectId, ref: 'Course', required: true},
    sessions:   {type: [ObjectId], ref: 'Session'}
});


//TODO
Subject.methods.update = function(grade_code) {
    var assignaturesProvider = new AssignaturesProvider(grade_code);

    var me = this;

    assignaturesProvider.FindCodiAssignaturaByName(function(codi_assignatura) {
        me.codi.push(codi_assignatura);
        me.save();
    }, this.name);
}

var Subject = mongoose.model('Subject', Subject);

module.exports = Subject;