/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 21/03/13
 * Time: 21:11
 * To change this template use File | Settings | File Templates.
 */
// Constructor
var Sessio = require('../models/Sessio');

var Block = function(params) {
    this.sessions = new Array();
};

// properties and methods
Block.prototype = {
    newSessio: function() {
        var sessio = new Sessio();
        this.sessions.push(sessio);
    },
    getSessio: function(index) {
        return this.sessions[index];
    },
    getCurrentSessio: function() {
        return this.sessions[this.sessions.length - 1];
    },
    getSessions: function() {
        return this.sessions;
    }
};

// node.js module export
module.exports = Block;