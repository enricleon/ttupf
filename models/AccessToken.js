/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 30/05/13
 * Time: 23:42
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AccessToken = new Schema({
    token:  {type: String, required: true, unique: true, index: true},
    client: {type: ObjectId, ref: 'Client', required: true},
    user:   {type: ObjectId, ref: 'User', required: true}
});

var AccessToken = mongoose.model('AccessToken', AccessToken);

module.exports = AccessToken;