
/*
 * GET users listing.
 */

exports.profile = function(req, res){
    res.render('profile', {user: req.user, title: "Perfil d'usuari"});
};