/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 15:51
 * To change this template use File | Settings | File Templates.
 */
var request = require("request");

exports.getHtmlFrom = function(carreraCurs, callback) {
    request(carreraCurs, function (error, response, body) {
        if (!error)
            callback(body);
        else
            console.log(error);
    });
}

exports.getCarreraCursos = function() {

}

