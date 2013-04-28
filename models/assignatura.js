/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:39
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Assignatura = new Schema({
    nom:        {type: String, required: true, unique: true, index: true},
    curs:       {type: ObjectId, ref: 'Curs', required: true},
    sessions:   {type: [ObjectId], ref: 'Sessio'}
});

var Assignatura = mongoose.model('Assignatura', Assignatura);

module.exports = Assignatura;