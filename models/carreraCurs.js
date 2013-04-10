/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose')
    , xpath = require('xpath')
    , querystring = require('querystring')
    , http = require('http')
    , timetableApi = require('../providers/timetableApi');

var carreraCursSchema = mongoose.Schema({
    url_horari: {type: String, required: true},
    grup_teoria: {type: String, required: true},
    grau:       {type: mongoose.Schema.ObjectId, ref: 'Grau', required: true},
    curs:       {type: mongoose.Schema.ObjectId, ref: 'Curs', required: true},
    periode:    {type: mongoose.Schema.ObjectId, ref: 'Periode', required: true}
});

carreraCursSchema.methods.actualitza = function(body){
    if (body != undefined) {
        var data = querystring.stringify({
            'tablength': 4,
            'linelength': 100,
            'output-charset': 'UTF-8',
            'input-charset': 'UTF-8'
        });

        var request = require('request');
        var self = this;
        request.post({
            headers: {
                "Content-type": "text/html",
                "Accept": "application/xhtml+xml"
            },
            url:    'http://www.it.uc3m.es/jaf/cgi-bin/html2xhtml.cgi?' + data,
            body:   body
        }, function(error, response, body){
            console.log(response.toString());
            timetableApi.parseCarreraCurs(body, self);
        });
    } else {
        timetableApi.getHtmlFrom(this.url_horari, this.actualitza);
    }
};

var CarreraCurs = mongoose.model('CarreraCurs', carreraCursSchema);

module.exports = CarreraCurs;