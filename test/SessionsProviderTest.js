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
var date = require('../providers/date');
var SessionsProvider = require('../providers/SessionsProvider');

Vows.describe('SessionsProvider Test').addBatch({
    'Sessions with different types': {
        topic: function() {
            var html = '<td id="cela_15"><div align="center">Sistemes Operatius <br><b>SEMINARI</b><br>S102: 52.329<br><b>PRÀCTIQUES</b><br>P102: 54.004<br></div></td>';
            var data = date.parse("11/01/2013 18:30");

            var blockToTest = new Block(html, data);

            blockToTest.Finish = this.callback;

            var sessionsProvider = new SessionsProvider();
            sessionsProvider.ParseBlock(blockToTest);
        },

        'has two sessions': function(topic) {
            Assert.equal(topic.sessions.length, 2);
        },
        'the first session is a PRÀCTIQUES session': function(topic) {
            Assert.equal(topic.sessions[0].tipus, "PRÀCTIQUES");
        },
        'the second session is a SEMINARI session': function(topic) {
            Assert.equal(topic.sessions[1].tipus, "SEMINARI");
        }
    }
}).export(module); // Export the Suite