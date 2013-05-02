
/*
 * GET tests
 */

var SessionsProviderTest = require('../test/SessionsProviderTest');

exports.parsertest = function(req, res){
    res.render('simpleMessage', { title: 'SessionsProvider Test', message: 'running tests...' });
    SessionsProviderTest.Blocks.run();
};