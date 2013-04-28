/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    xpath = require('xpath'),
    querystring = require('querystring'),
    http = require('http'),
    timetableApi = require('../providers/TimetableProvider'),
    tidy = require('htmltidy').tidy;

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var CarreraCurs = new Schema({
    url_horari:     {type: String, required: true, unique: true, index: true},
    grup_teoria:    {type: String, required: true},
    grau:           {type: ObjectId, ref: 'Grau', required: true},
    curs:           {type: ObjectId, ref: 'Curs', required: true},
    periode:        {type: ObjectId, ref: 'Periode', required: true}
});

CarreraCurs.methods.actualitza = function(body){
    if (body != undefined) {
        tidy(body, function(err, html) {
            timetableApi.parseCarreraCurs(html);
        });
    } else {
        timetableApi.getHtmlFrom(this);
    }
};

var CarreraCurs = mongoose.model('CarreraCurs', CarreraCurs);

module.exports = CarreraCurs;