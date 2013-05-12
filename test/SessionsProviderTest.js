/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 27/04/13
 * Time: 18:22
 * To change this template use File | Settings | File Templates.
 */

var Vows = require('vows'),
  Assert = require('assert');

var Block = require('../providers/Block');
var Date = require('../public/js/date');
var GradeCourse = require('../models/GradeCourse');
var SessionsProvider = require('../providers/SessionsProvider');

Vows.describe('Blocks').addBatch({
    'Block with multiple grups and aulas in the same line': {
        topic: function() {
            var html = '<td><div align="center">Taller de Música Electrònica<br><b>SEMINARI</b><br>S101 i S103: 54.008 i 54.009<br></div></td>';
            var date = Date.parse("18/04/2013 12:30");

            var blockToTest = new Block(html, date);

            blockToTest.Finish = this.callback;

            var gei_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GET_C2_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var sessionsProvider = new SessionsProvider(gei_c1_t2_g1);
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 2);
        },
        'the first session should be a SEMINARI session': function(topic) {
            Assert.equal(topic.sessions[0].type, "SEMINARI");
        },
        'the second session should be also a SEMINARI session': function(topic) {
            Assert.equal(topic.sessions[1].type, "SEMINARI");
        }
    },
    'Block with different typed sessions': {
        topic: function() {
            var html = '<td id="cela_15"><div align="center">Sistemes Operatius <br><b>SEMINARI</b><br>S102: 52.329<br><b>PRÀCTIQUES</b><br>P102: 54.004<br></div></td>';
            var date = Date.parse("11/01/2013 18:30");

            var blockToTest = new Block(html, date);

            blockToTest.Finish = this.callback;

            var sessionsProvider = new SessionsProvider();
            sessionsProvider.ParseBlock(blockToTest);
        },

        'should have two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 2);
        },
        'the first session should be a PRÀCTIQUES session': function(topic) {
            Assert.equal(topic.sessions[0].type, "PRÀCTIQUES");
        },
        'the second session should be a SEMINARI session': function(topic) {
            Assert.equal(topic.sessions[1].type, "SEMINARI");
        }
    },
    'Block with two assignatures': {
        topic: function() {
            var html = '<td><div align="center">Protocols Distribuïts<br><b>TEORIA</b><br>Aula: 52.223<br>----------------------------------------<br>Administració de Sistemes Operatius<br><b>PRÀCTIQUES</b><br>P102: 54.003<br></div></td>';
            var date = Date.parse("18/04/2013 18:30");

            var blockToTest = new Block(html, date);

            blockToTest.Finish = this.callback;

            var gei_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GET_C2_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var sessionsProvider = new SessionsProvider(gei_c1_t2_g1);
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 2);
        },
        'the first session should be a PRÀCTIQUES session': function(topic) {
            Assert.equal(topic.sessions[0].type, "PRÀCTIQUES");
        },
        'the first session should belong to an assignatura named Administració de Sistemes Operatius': function(topic) {
            Assert.equal(topic.sessions[0].subject, "Administració de Sistemes Operatius");
        },
        'the second session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[1].type, "TEORIA");
        },
        'the second session should belong to an assignatura named Protocols Distribuïts': function(topic) {
            Assert.equal(topic.sessions[1].subject, "Protocols Distribuïts");
        }
    }
}).export(module); // Export the Suite