/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 30/05/13
 * Time: 23:42
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Client = new Schema({
    name:           {type: String, required: true},
    client_id:      {type: String, required: true, unique: true, index: true},
    client_secret:  {type: String, required: true}
});

var Client = mongoose.model('Client', Client);

module.exports = Client;