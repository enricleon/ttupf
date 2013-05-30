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

var AuthorizationCode = new Schema({
    code:           {type: String, required: true, unique: true, index: true},
    redirect_uri:   {type: String, required: true},
    client:         {type: ObjectId, ref: 'Client', required: true},
    user:           {type: ObjectId, ref: 'User', required: true}
});

var AuthorizationCode = mongoose.model('AuthorizationCode', AuthorizationCode);

module.exports = AuthorizationCode;