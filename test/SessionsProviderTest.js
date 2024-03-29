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
            var html = '<td><div >Taller de Música Electrònica<br><b>SEMINARI</b><br>S101 i S103: 54.008 i 54.009<br></div></td>';
            var date = Date.parse("18/04/2013 12:30");

            var gei_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GET_C2_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, gei_c1_t2_g1);

            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
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
            var html = '<td id="cela_15"><div>Sistemes Operatius <br><b>SEMINARI</b><br>S102: 52.329<br><b>PRÀCTIQUES</b><br>P102: 54.004<br></div></td>';
            var date = Date.parse("11/01/2013 18:30");

            var blockToTest = new Block(html, date);

            blockToTest.finish = this.callback;

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
            var html = '<div>Geometria Computacional<br><b>TEORIA</b><br>Aula: 52.105<br>--------------------------------------<br>Enginyeria de Programari per a Aplicacions Web<br><b>SEMINARI</b><br>S101: 54.004<br>S102: 54.003<br></div>';
            var date = Date.parse("18/04/2013 18:30");

            var gei_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1213/graus12_13/horaris_1213_GET_C2_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, gei_c1_t2_g1);

            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 3);
        },
        'the first session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[0].type, "SEMINARI");
        },
        'the first session should have the group S102': function(topic) {
            Assert.equal(topic.sessions[0].group, "S102");
        },
        'the first session should belong to an assignatura named Enginyeria de Programari per a Aplicacions Web': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Enginyeria de Programari per a Aplicacions Web");
        },
        'the third session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[2].type, "TEORIA");
        },
        'the third session should belong to an assignatura named Geometria Computacional': function(topic) {
            Assert.equal(topic.sessions[2].subject_name, "Geometria Computacional");
        }
    },
    'Block with custom type and comment': {
        topic: function() {
            var html = '<div>Finances en Projectes Tecnològics<br><b>SEMINARI PROJECTES</b><br>Ascensor Intel·ligent<br>Aula: 52.329<br></div>';
            var date = Date.parse("13/11/2013 16:30");

            var get_c4_t1_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_GET_C4_T1_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, get_c4_t1_g1);
            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
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
            var html = '<td><div>Algebra Lineal i Matemàtica Discreta<br><b>TEORIA</b><br>T1A: 52.223<br>T1B: 52.119<br></div></td>';
            var date = Date.parse("25/09/2013 10:30");

            var gei_c1_t1_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_GEI_C1_T1_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, gei_c1_t1_g1);

            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
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
            var html = "<td id='cela_1'><div>Processament d'Imatges en Color<br /><B>TEORIA</B><br />Aula: 52.119<br /></div></td>";
            var date = Date.parse("18/02/2014 12:30");

//            blockToTest.usesDatabase = true;

//            mongoose.connect('mongodb://ttupf_mongolab:L_1i2o9n2@ds027748.mongolab.com:27748/ttupf_mongolab');
//            mongoose.connect('localhost:27017/ttupf');

            var opt_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_OPT_C1_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, opt_c1_t2_g1);

            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
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
    'Block with subject name different from the one on database (only a word)': {
        topic: function() {
            var html = '<td id="cela_106"><div>Enginyeria de Programari per a Aplicacions Web<br><b>PRÀCTIQUES</b><br>Aula: 54.003<br></div></td>';
            var date = Date.parse("09/01/2014 18:30");

//            blockToTest.usesDatabase = true;

//            mongoose.connect('mongodb://ttupf_mongolab:L_1i2o9n2@ds027748.mongolab.com:27748/ttupf_mongolab');
//            mongoose.connect('localhost:27017/ttupf');

            var opt_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_OPT_C1_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, opt_c1_t2_g1);

            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have one session': function(topic) {
            Assert.equal(topic.sessions.length, 1);
        },
        'the first session assignatura name should be "Enginyeria de Programari per a Aplicacions Web"': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Enginyeria de Programari per a Aplicacions Web");
        },
        'the first session must be a PRÀCTIQUES session': function(topic) {
            Assert.equal(topic.sessions[0].type, "PRÀCTIQUES");
        }
    },
    'Block with hours in same line of session': {
        topic: function() {
            var html = '<td id="cela_19"><div align="center">Geometria Computacional<br><b>SEMINARI</b><br>de 18:30 a 19:30 - S101: 54.030<br>de 19:30 a 20:30 - S102: 54.030<br>--------------------------------------<br>Enginyeria de Programari per a Aplicacions Web<br><b>TEORIA</b><br>Aula: 54.006<br></div></td>';
            var date = Date.parse("09/01/2014 18:30");

//            blockToTest.usesDatabase = true;

//            mongoose.connect('mongodb://ttupf_mongolab:L_1i2o9n2@ds027748.mongolab.com:27748/ttupf_mongolab');
//            mongoose.connect('localhost:27017/ttupf');

            var opt_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_OPT_C1_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, opt_c1_t2_g1);

            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have three sessions': function(topic) {
            Assert.equal(topic.sessions.length, 3);
        },
        'the first session assignatura name should be "Enginyeria de Programari per a Aplicacions Web"': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Enginyeria de Programari per a Aplicacions Web");
        },
        'the first session must be a PRÀCTIQUES session': function(topic) {
            Assert.equal(topic.sessions[0].type, "TEORIA");
        }
    },
    'Block with hours': {
        topic: function() {
            var html = '<td id="cela_2"><div align="center">Enginyeria d’Interacció<br><b>PRÀCTIQUES</b><br>8:30 - 9:30<br>P101: 54.004<br>9:30 - 10:30<br>P102: 54.004<br></div></td>';
            var date = Date.parse("26/01/2014 8:30");

//            blockToTest.usesDatabase = true;

//            mongoose.connect('mongodb://ttupf_mongolab:L_1i2o9n2@ds027748.mongolab.com:27748/ttupf_mongolab');
//            mongoose.connect('localhost:27017/ttupf');

            var gei_c1_t1_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_GEI_C1_T1_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, gei_c1_t1_g1);

            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 2);
        },
        'the first session assignatura name should be "Enginyeria d’Interacció"': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Enginyeria d’Interacció");
        },
        'the first session must be a PRÀCTIQUES session': function(topic) {
            Assert.equal(topic.sessions[0].type, "PRÀCTIQUES");
        },
        'the first session must start on 9:30': function(topic) {
            Assert.equal(topic.sessions[0].timestamp_start.getHours(), 9);
            Assert.equal(topic.sessions[0].timestamp_start.getMinutes(), 30);
        },
        'the first session must end on 10:30': function(topic) {
            Assert.equal(topic.sessions[0].timestamp_end.getHours(), 10);
            Assert.equal(topic.sessions[0].timestamp_end.getMinutes(), 30);
        },
        'the second session must start on 8:30': function(topic) {
            Assert.equal(topic.sessions[1].timestamp_start.getHours(), 8);
            Assert.equal(topic.sessions[1].timestamp_start.getMinutes(), 30);
        },
        'the second session must end on 9:30': function(topic) {
            Assert.equal(topic.sessions[1].timestamp_end.getHours(), 9);
            Assert.equal(topic.sessions[1].timestamp_end.getMinutes(), 30);
        }
    },
    'Block of 2 conflictive sessions': {
        topic: function() {
            var html = '<div align="center">Sistemes Multimedia<br><b>TEORIA</b><br>Aula: 52.217<br>--------------------------------------<br>Principis de Percepció Aplicats al Disseny<br><b>TEORIA</b><br>Aula: 52.105<br></div>';
            var date = Date.parse("10/02/2014 16:30");

            var opt_c1_t2_g1 = new GradeCourse({
                timetable_url: "http://www.upf.edu/esup/docencia/horaris1314/horaris_1314_OPT_C1_T2_G1.html",
                theory_group: "1",
                grade: null,
                period: null,
                course: null
            });

            var blockToTest = new Block(html, date, opt_c1_t2_g1);
            blockToTest.finish = this.callback;

            var sessionsProvider = new SessionsProvider();
            sessionsProvider.ParseBlock(blockToTest);
        },
        'should have two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 2);
        },
        'the first session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[0].type, "TEORIA");
        },
        'the first session should have the group S102': function(topic) {
            Assert.equal(topic.sessions[0].classroom, "52.105");
        },
        'the first session should belong to an assignatura named Enginyeria de Programari per a Aplicacions Web': function(topic) {
            Assert.equal(topic.sessions[0].subject_name, "Principis de Percepció Aplicats al Disseny");
        },
        'the third session should be a TEORIA session': function(topic) {
            Assert.equal(topic.sessions[1].classroom, "52.217");
        },
        'the third session should belong to an assignatura named Geometria Computacional': function(topic) {
            Assert.equal(topic.sessions[1].subject_name, "Sistemes Multimedia");
        }
    }
}).export(module); // Export the Suite