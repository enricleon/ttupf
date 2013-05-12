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

var sessionsProvider;

exports.GetHtmlFrom = function(gradeCourse) {
    sessionsProvider = new SessionsProvider(gradeCourse);
    request.get(gradeCourse.timetable_url, {encoding: "binary"}, function (error, response, body) {
        if (!error)
            gradeCourse.update(body);
        else
            console.log(error);
    });
}

exports.ParseGradeCourse = function(body) {
    var xml = body;
    var doc = new dom().parseFromString(xml);

    //Agafem les setmanes del dom
    var nodes = xpath.select("//html/body/descendant::table", doc);

    nodes.forEach(parseWeek);
}

var dies;
var hores;
var setmana;

var parseWeek = function(item, index) {
    var doc = new dom().parseFromString(item.toString());

    dies = xpath.select("//tbody/tr[2]/td[position() >= 2]/descendant::strong/text()", doc);
    hores = xpath.select("//tbody/tr[position() >= 3]/td/div/strong/text()", doc);
    setmana = index;

    var dia_franja = xpath.select("//tbody/tr[position() >= 3]/td[position() >= 2 and contains(@id, 'cela')]", doc);
    dia_franja.forEach(parseDay);
}

var parseDay = function(item, index) {
    var hora = hores[Math.floor(index/dies.length)].toString();
    var dia = dies[index % dies.length].toString();

    var hora = sessionsProvider.GetInitialTime(hora);
    var data = date.parse(dia + " " + hora);

    var currentBlock = new Block(item, data);

    sessionsProvider.ParseBlock(currentBlock);
}

