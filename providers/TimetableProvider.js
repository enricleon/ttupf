/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 15:51
 * To change this template use File | Settings | File Templates.
 */
var request = require("request"),
    xpath = require('xpath'),
    dom = require('xmldom').DOMParser,
    Block = require('./Block'),
    moment = require('moment-timezone'),
    SessionsProvider = require('./SessionsProvider');

var attempts = 0;
var maxAttempts = 10;
var sessionsProvider;

exports.GetHtmlFrom = function(gradeCourse) {
    var me = this;

    sessionsProvider = new SessionsProvider();
    request.get(gradeCourse.timetable_url, {encoding: "binary", timeout: 30000}, function (error, response, body) {
        if (!error) {
            attempts = 0;
            gradeCourse.update(body);
        }
        else {
            attempts++;
            if(attempts > maxAttempts) {
                console.log(error);
                attempts = 0;
            }
            else {
                me.GetHtmlFrom(gradeCourse);
            }
        }
    });
}

exports.ParseGradeCourse = function(body, gradeCourse) {
    var xml = body;
    var doc = new dom().parseFromString(xml);

    //Agafem les setmanes del dom
    var nodes = xpath.select("/html/body//table/tbody", doc);

    console.log("\n---- URL: " + gradeCourse.timetable_url);

    nodes.forEach(function(node, index) {
        parseWeek(node, index, gradeCourse);
    });
}

var dies;
var hores;
var setmana;

var parseWeek = function(item, index, gradeCourse) {
    var doc = new dom().parseFromString(item.toString());

    dies = xpath.select("//tr[2]/child::td[position() >= 2]/descendant::strong/text()", doc);
    hores = xpath.select("//tr[position() >= 3]/td/div/strong/text()", doc);
    setmana = index;

    var dia_franja = xpath.select("//tr[position() >= 3]//td[not(position() = 1) and not(position() = 7) and not(position() = 13) and not(position() = 19) and not(position() = 25) and not(position() = 31) and not(position() = 37)]/div", doc);
    dia_franja.forEach(function(item, index) {
        parseDay(item, index, gradeCourse);
    });
}

var parseDay = function(item, index, gradeCourse) {
    try {
        var hora = hores[Math.floor(index/dies.length)].toString();
    }
    catch(ex) {
        console.log("Index: " + index, ", Hora: " + Math.floor(index/dies.length) + ", Dies: " + dies.length);
    }
    var dia = dies[index % dies.length].toString();

    var hora = sessionsProvider.GetInitialTime(hora);

    var day = dia.split("/")[0];
    var month = dia.split("/")[1];
    var year = dia.split("/")[2];
    var hour = hora.split(":")[0];
    var minute = hora.split(":")[1];

    var _date = moment.tz([year, month, day, hour, minute], 'Europe/Amsterdam');

    var currentBlock = new Block(item, _date, gradeCourse);
    currentBlock.usesDatabase = true;

    sessionsProvider.ParseBlock(currentBlock);
}

