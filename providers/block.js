/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 21/03/13
 * Time: 21:11
 * To change this template use File | Settings | File Templates.
 */
// Constructor
var Sessio = require('../models/Sessio');

var Block = module.exports = function(html, data) {
    this.sessions = [];
    this.data = data;
    this.html = html;
};

// properties and methods
Block.prototype = {
    NewSessio: function(group, aules) {
        var sessio = new Sessio();

        if(typeof group != 'undefined') sessio.grup = group;
        if(typeof aules != 'undefined') sessio.aula = aules;

        this.sessions.push(sessio);
    },
    GetSessio: function(index) {
        return this.sessions[index];
    },
    GetLastSessio: function() {
        return this.sessions[this.sessions.length - 1];
    },
    GetSessions: function() {
        return this.sessions;
    },
    SaveSessions: function() {
        this.sessions.forEach(function(element) {
            element.save(function (err) {
                if(err != null)
                    console.log("Alguna cosa ha passat guardant la sessió: " + err.message);
            });
        });
    },
    SetPropertyToAll: function(property, value, override) {
        this.sessions.forEach(function (element) {
            if(override || !element[property]) {
                element[property] = value;
            }
        });
    }
};