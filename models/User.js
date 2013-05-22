/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 4/05/13
 * Time: 23:11
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name:       {type: String, required: true},
    last_name:  {type: String},
    email:      {type: String, required: true, unique: true, index: true}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);