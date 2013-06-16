/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 16/06/13
 * Time: 12:30
 * To change this template use File | Settings | File Templates.
 */
var ScopeProvider = module.exports = function() {};

ScopeProvider.RestrictScope = function(scope, query, model, user) {
    switch(scope) {
        case "own_relations": {
            OwnRelations(query, model, user);
        }
            break;
        default:
            break;
    }
};

var OwnRelations = function(query, model, user) {
    query["$or"] = [];
    for(var key in model.schema.paths) {
        if(model.schema.paths[key].instance === "ObjectID") {
            var condition = new Object;
            condition[key] = user._id;
            query["$or"].push(condition);
        }
    }
};