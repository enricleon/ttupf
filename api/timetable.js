/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 15/02/13
 * Time: 20:29
 * To change this template use File | Settings | File Templates.
 */

/*
 * GET This renders the timetable index
 */
exports.index = function(req, res){
    res.send(JSON.stringify({response: "Timetable index!"}));
};

