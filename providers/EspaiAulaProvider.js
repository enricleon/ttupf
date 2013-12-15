var request = require("request"),
    xpath = require('xpath'),
    dom = require('xmldom').DOMParser;

var EnrollmentsProvider = require('./EnrollmentsProvider');

var EspaiAulaProvider = module.exports = function(user) {
    this.url_espai_aula = "http://campusglobal.upf.edu/GEL/SVGELPortal";
    this.url_login_campusglobal = "https://campusglobal.upf.edu/Portal/SVLogin";
    this.url_campusglobal = "http://campusglobal.upf.edu/Portal/SVEntradaPortalServlet";
    this.user = user;
};

EspaiAulaProvider.prototype.SynchroniseUPFProfile = function(username, password, callback) {
    this.username = username;
    this.password = password;

    var me = this;

    this.LoginCampusGlobal(function(espaiaula) {
        var enrollmentsProvider = new EnrollmentsProvider(me.user, callback);
        console.log(espaiaula);
        enrollmentsProvider.Start(espaiaula);
    });
};

EspaiAulaProvider.prototype.LoginCampusGlobal = function(callback) {
    var me = this;
    console.log("User: ", me.username);
    console.log("Password: ", me.password);
    request({
        uri: me.url_login_campusglobal,
        method: "post",
        followAllRedirects: true,
        form: {
            login: me.username,
            passwd: me.password
        }
    }, function(error, response, body) {
        me.GetCampusGlobal(callback);
    });
};

EspaiAulaProvider.prototype.GetCampusGlobal = function(callback) {
    var me = this;
    request({
        uri: me.url_campusglobal,
        method: "get",
        followAllRedirects: true
    }, function(error, response, body) {
        me.GetEspaiAula(callback);
    });
};

EspaiAulaProvider.prototype.GetEspaiAula = function(callback) {
    var me = this;
    request({
        uri: me.url_espai_aula,
        method: "post",
        encoding: "binary",
        form: {
            OPERACIO: "ESTUDIANT",
            ANYACADEMIC: "2013",
            cg_opciomenu: "Espai Aula"
        }
    }, function(error, response, body) {
        callback(body);
    });
};