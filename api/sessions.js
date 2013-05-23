var date = require('../public/js/date');
var EspaiAulaProvider = require('../providers/EspaiAulaProvider');

exports.config = function(req, res){
    var unis = req.body.unis;
    var password = req.body.password;

    var espaiAulaProvider = new EspaiAulaProvider(req.user);
    espaiAulaProvider.SynchroniseUPFProfile(unis, password, function(err) {
        if(!err) {
            res.send({response: "ok"});
        }
        else {
            res.send({response: "ko", error: err});
        }
    });
};