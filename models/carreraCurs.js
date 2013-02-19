/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');

var carreraCursSchema = mongoose.Schema({
    url_horari: 'string'
});

var CarreraCurs = mongoose.model('CarreraCurs', carreraCursSchema);

module.exports = CarreraCurs;