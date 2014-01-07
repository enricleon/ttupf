/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 21/03/13
 * Time: 21:11
 * To change this template use File | Settings | File Templates.
 */
// Constructor
var Sessio = require('../models/Session');

var Block = module.exports = function(html, data, gradeCourse) {
    this.sessions = [];
    this.data = data;
    this.html = html;
    this.lines = [];
    this.currentLine = -1;
    this.usesDatabase = false;
    this.gradeCourse = gradeCourse;
};

// properties and methods
Block.prototype = {
    NewSession: function(group, classrooms) {
        var session = new Sessio();

        if(typeof group != 'undefined') session.group = group;
        if(typeof classrooms != 'undefined') session.classroom = classrooms;

        this.sessions.push(session);
    },
    GetSessions: function() {
        return this.sessions;
    },
    SetPropertyToAll: function(property, value, override) {
        for(var i = 0; i < this.sessions.length; i++) {
            var element = this.sessions[i];
            if(override || !element[property]) {
                element[property] = value;
            }
        }
    },
    Reset: function() {
        this.sessions = [];
    }
};