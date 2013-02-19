/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var timetableApi = require('../providers/timetableApi');

var carreraCursSchema = mongoose.Schema({
    url_horari: {type: String, required: true},
    grau:       {type: mongoose.Schema.ObjectId, ref: 'Grau', required: true},
    curs:       {type: mongoose.Schema.ObjectId, ref: 'Curs', required: true},
    periode:    {type: mongoose.Schema.ObjectId, ref: 'Periode', required: true}
});

carreraCursSchema.methods.getAssignatures = function(body){
    if(body == undefined) {
        timetableApi.getHtmlFrom(this.url_horari, this.getAssignatures);
    }
    else {
        console.log(body);
        //html/body/descendant::table son les semanes
        //html/body/descendant::table/tr son les files de la taula. La 1 son els dies de la setmana la 2 son els dies
        //html/body/descendant::table/tr/td/descendant::strong Son els dies. EL primer es string "HORA" els altres son format Date
        //Amb aquest parse a cada fila de la taula de la 3 a la 5 treiem la hora en format 12:30-14:30
        //A cada fila de la columna podem treure la casella amb html/body/descendant::table/tr/td/div on el td te una id del pal cela_1
    }
};

var CarreraCurs = mongoose.model('CarreraCurs', carreraCursSchema);

module.exports = CarreraCurs;