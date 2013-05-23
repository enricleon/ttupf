/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 9/05/13
 * Time: 18:10
 * To change this template use File | Settings | File Templates.
 */

/*
 * GET This renders the specified user profile in json
 */
exports.profile = function(req, res){
    res.send(JSON.stringify({response: "User profile retrived succesfully!"}));
};

/*
 * POST this creates a new user from the received data.
 */
exports.new = function(req, res){
    res.send(JSON.stringify({response: "User created successfully!"}));
};

/*
 * PUT Saves changes on user
 */
exports.edit = function(req, res){
    res.send(JSON.stringify({response: "User edited successfully!"}));
};