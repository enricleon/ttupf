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

var mongoose = require('mongoose');

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
            Assert.equal(2, 2);
        },
        'the first session should be a SEMINARI session': function(topic) {
            Assert.equal("SEMINARI", "SEMINARI");
        },
        'the second session should be also a SEMINARI session': function(topic) {
            Assert.equal("SEMINARI", "SEMINARI");
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
            Assert.equal(topic.sessions[0].subject_name, "Administració de Sistemes Operatius");
        },
        'the second session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[1].type, "TEORIA");
        },
        'the second session should belong to an assignatura named Protocols Distribuïts': function(topic) {
            Assert.equal(topic.sessions[1].subject_name, "Protocols Distribuïts");
        }
    },
    'Block with custom type and comment': {
        topic: function() {
            var html = '<div align="center">Finances en Projectes Tecnològics<br><b>SEMINARI PROJECTES</b><br>Ascensor Intel·ligent<br>Aula: 52.329<br></div>';
            var date = Date.parse("13/11/2013 16:30");

            var blockToTest = new Block(html, date);

            blockToTest.Finish = this.callback;

            var get_c4_t1_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_GET_C4_T1_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var sessionsProvider = new SessionsProvider(get_c4_t1_g1);
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have one sessions': function(topic) {
            Assert.equal(topic.sessions.length, 1);
        },
        'the session should be a SEMINARI PROJECTES session': function(topic) {
            Assert.equal(topic.sessions[0].type, "SEMINARI PROJECTES");
        },
        'the session should belong to a subject named "Finances en Projectes Tecnològics"': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Finances en Projectes Tecnològics");
        },
        'the session should have the comment: "Ascensor Intel·ligent"': function(topic) {
            Assert.equal(topic.sessions[0].comment, "Ascensor Intel·ligent");
        }
    },
    'Block with theory groups A and B': {
        topic: function() {
            var html = '<td><div align="center">Algebra Lineal i Matemàtica Discreta<br><b>TEORIA</b><br>T1A: 52.223<br>T1B: 52.119<br></div></td>';
            var date = Date.parse("25/09/2013 10:30");

            var blockToTest = new Block(html, date);

            blockToTest.Finish = this.callback;

            var gei_c1_t1_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_GEI_C1_T1_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var sessionsProvider = new SessionsProvider(gei_c1_t1_g1);
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 2);
        },
        'the first session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[0].type, "TEORIA");
        },
        'the first session group should be 1': function(topic) {
            Assert.equal(topic.sessions[0].group, "1");
        },
        'the second session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[1].type, "TEORIA");
        },
        'the second session group should be 1': function(topic) {
            Assert.equal(topic.sessions[1].group, "1");
        }
    },
    'Block with apostrophe on subject name': {
        topic: function() {
            var html = "<td id='cela_1'><div align = 'center'>Processament d'Imatges en Color<br /><B>TEORIA</B><br />Aula: 52.119<br /></div></td>";
            var date = Date.parse("18/02/2014 12:30");

            var blockToTest = new Block(html, date);

//            mongoose.connect('mongodb://ttupf_mongolab:L_1i2o9n2@ds027748.mongolab.com:27748/ttupf_mongolab');
            mongoose.connect('localhost:27017/ttupf');

            var opt_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_OPT_C1_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var sessionsProvider = new SessionsProvider(opt_c1_t2_g1);
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have one session': function(topic) {
            Assert.equal(topic.sessions.length, 1);
        },
        'the first session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[0].type, "TEORIA");
        },
        'the first session group should be 1': function(topic) {
            Assert.equal(topic.sessions[0].group, "1");
        },
        'the first session assignatura name should be "Processament d\'Imatges en Color"': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Processament d'Imatges en Color");
        }
    },
    'Block with apostrophe on subject name': {
        topic: function() {
            var html = '<td id="cela_3"><div align="center">Computació Intel·ligent i Llenguatge Natural<br><b>TEORIA</b><br>Aula: 52.119<br></div></td>';
            var date = Date.parse("09/01/2014 8:30");

            var blockToTest = new Block(html, date);

//            blockToTest.Finish = this.callback;

//            mongoose.connect('mongodb://ttupf_mongolab:L_1i2o9n2@ds027748.mongolab.com:27748/ttupf_mongolab');
            mongoose.connect('localhost:27017/ttupf');

            var gei_c3_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_GEI_C3_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var sessionsProvider = new SessionsProvider(gei_c3_t2_g1);
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have one session': function(topic) {
            Assert.equal(topic.sessions.length, 1);
        },
        'the first session assignatura name should be "Computació Intel·ligent i Llenguatge Natural"': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Computació Intel·ligent i Llenguatge Natural");
        }
    }
}).export(module); // Export the Suite