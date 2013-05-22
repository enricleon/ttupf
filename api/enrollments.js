/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 21/05/13
 * Time: 23:26
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

var Enrollment = require('../models/Enrollment');

exports.edit = function(res, req) {
    req = req.req;
    res = res.res;

    var current_user = req.user;
    var body = req.body;

    if(body.enrollment && body.seminar_group && body.practicum_group) {
        Enrollment.findOneAndUpdate({_id: body.enrollment}, {seminar_group: body.seminar_group, practicum_group: body.practicum_group}, {}, function(err, doc) {
            res.send({enrollment: doc, error: err});
        });
    }
    else {
        res.send({text: "missing fields"});
    }
}