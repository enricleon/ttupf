/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 10:26
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var Date = require('../public/js/date');

var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var Session = require('./Session');

var Enrollment = new Schema({
    theory_group:        {type: String},
    practicum_group:    {type: String},
    seminar_group:      {type: String},
    user:          {type: ObjectId, ref: 'User', required: true},
    subject:        {type: ObjectId, ref: 'Subject', required: true}
});

Enrollment.statics.GetSessionsByUserForDate = function(user, target_d, num_days, callback) {
    if(!num_days) num_days = 1;

    var next_d = new Date(target_d).add({days: num_days});

    this.find({user: user}).populate("subject").exec(function(err, docs){
        var sessions = [];
        var count = docs.length;
        docs.forEach(function(enrollment) {
            Session.findOne({_id: {$in: enrollment.subject.sessions}, timestamp_start: {$gte: target_d, $lt: next_d}}).exec(function(err, doc) {
                if(!err && doc) {
                    var session = doc.toObject();
                    delete session._id;
                    session.subject = enrollment.subject.name;
                    console.log(JSON.stringify(session));
                    sessions.push(session);
                }
                else{
                    callback(err, sessions);
                }
                if(!--count) {
                    callback(null, sessions);
                }
            });
        });
    });
}

var Enrollment = mongoose.model('Enrollment', Enrollment);

module.exports = Enrollment;