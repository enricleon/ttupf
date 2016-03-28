var request = require("request").defaults({jar: true}),
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
    console.log("--------------LOGIN-------------");
    console.log("User: " + me.username);
    console.log("Password: " + me.password);
    console.log("Url: " + me.url_login_campusglobal);
    request({
        uri: me.url_login_campusglobal,
        method: "post",
        followAllRedirects: true,
        form: {
            login: me.username,
            passwd: me.password
        }
    }, function(error, response, body) {
        console.log("Error: " + error);
        console.log("Response: " + response);
        console.log("Body: " + body);
        me.GetCampusGlobal(callback);
    });
};

EspaiAulaProvider.prototype.GetCampusGlobal = function(callback) {
    var me = this;
    console.log("--------------CAMPUS GLOBAL-------------");
    console.log("Url: " + me.url_campusglobal);
    request({
        uri: me.url_campusglobal,
        followAllRedirects: true
    }, function(error, response, body) {
        console.log("Error: " + error);
        console.log("Response: " + response);
        console.log("Body: " + body);
        me.GetEspaiAula(callback);
    });
};

EspaiAulaProvider.prototype.GetEspaiAula = function(callback) {
    var me = this;
    console.log("--------------ESPAI AULA-------------");
    console.log("Url: " + me.url_espai_aula);
    request({
        uri: me.url_espai_aula,
        method: "post",
        encoding: "binary",
        form: {
            OPERACIO: "ESTUDIANT",
            ANYACADEMIC: "2015",
            cg_opciomenu: "Espai Aula"
        }
    }, function(error, response, body) {
        console.log("Error: " + error);
        console.log("Response: " + response);
        console.log("Body: " + body);
        callback(body);
    });
};