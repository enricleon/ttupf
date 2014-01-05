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
    date = require('./../public/js/date'),
    SessionsProvider = require('./SessionsProvider');

var attempts = 0;
var maxAttempts = 10;
var sessionsProvider;

exports.GetHtmlFrom = function(gradeCourse) {
    var me = this;

    sessionsProvider = new SessionsProvider(gradeCourse);
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

exports.ParseGradeCourse = function(body, timetable_url) {
    var xml = body;
    var doc = new dom().parseFromString(xml);

    //Agafem les setmanes del dom
    var nodes = xpath.select("/html/body//table/tbody", doc);

    console.log("\n---- URL: " + timetable_url);

    nodes.forEach(parseWeek);
}

var dies;
var hores;
var setmana;

var parseWeek = function(item, index) {
    var doc = new dom().parseFromString(item.toString());

    dies = xpath.select("//tr[2]/child::td[position() >= 2]/descendant::strong/text()", doc);
    hores = xpath.select("//tr[position() >= 3]/td/div/strong/text()", doc);
    setmana = index;

    var dia_franja = xpath.select("//tr[position() >= 3]//td[not(position() = 1) and not(position() = 7) and not(position() = 13) and not(position() = 19) and not(position() = 25) and not(position() = 31) and not(position() = 37)]/div", doc);
    dia_franja.forEach(parseDay);
}

var parseDay = function(item, index) {
    try {
        var hora = hores[Math.floor(index/dies.length)].toString();
    }
    catch(ex) {
        console.log("Index: " + index, ", Hora: " + Math.floor(index/dies.length) + ", Dies: " + dies.length);
    }
    var dia = dies[index % dies.length].toString();

    var hora = sessionsProvider.GetInitialTime(hora);
    var data = date.parse(dia + " " + hora);

    var currentBlock = new Block(item, data);
    currentBlock.usesDatabase = true;

    sessionsProvider.ParseBlock(currentBlock);
}

