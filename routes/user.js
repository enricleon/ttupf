
/*
 * GET users listing.
 */

var EspaiAulaProvider = require('../providers/EspaiAulaProvider');

exports.profile = function(req, res){
    switch(req.params.format) {
        case 'json': {
                res.send(JSON.stringify({user: req.user}));
            }
            break;
        default:
            res.render('profile', {user: req.user, title: "Perfil d'usuari"});
            break;
    }
};