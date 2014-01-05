var distance = require('distance');

var subjects_base;
var pushToDistanceDictionary = function(distance_dictionary, name, callback) {
    subjects_base.forEach(function(subject) {
        distance_dictionary.push({name: subject.name, distance: distance.levenshtein(subject.name, name), id: subject._id});
    });

    callback(distance_dictionary);
}

exports.DistanceDictionary = function(name, names_array, callback) {
    var distance_dictionary = [];

    if(names_array) {
        Object.keys(names_array).forEach(function(name_item) {
            distance_dictionary.push({name: name_item, distance: distance.levenshtein(AccentsTidy(name_item), AccentsTidy(name))});
        });
        return distance_dictionary;
    }
    else {
        var Subject = require("../models/Subject.js");
        if(!subjects_base) {
            Subject.find({}).exec(function(err, subjects) {
                if(!err && subjects) {
                    subjects_base = subjects;
                    pushToDistanceDictionary(distance_dictionary, name, callback);
                }
                else{
                    callback(null);
                }
            });
        }
        else {
            pushToDistanceDictionary(distance_dictionary, name, callback);
        }
    }
};

exports.LowerDistance = function(distance_dictionary) {
    if(distance_dictionary.length == 0) {
        return {distance: -1, name: 'none'};
    }

    var lower_distance = distance_dictionary[0].distance;
    var current_match = distance_dictionary[0];

    distance_dictionary.forEach(function(subject) {
        if(subject.distance < lower_distance) {
            lower_distance = subject.distance;
            current_match = subject;

        }
    });

    return {distance: lower_distance, name: current_match.name, id: current_match.id};
};

var AccentsTidy = function(s){
    var r=s.toLowerCase();
    r = r.replace(new RegExp("\\s", 'g'),"");
    r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
    r = r.replace(new RegExp("æ", 'g'),"ae");
    r = r.replace(new RegExp("ç", 'g'),"c");
    r = r.replace(new RegExp("[èéêë]", 'g'),"e");
    r = r.replace(new RegExp("[ìíîï]", 'g'),"i");
    r = r.replace(new RegExp("ñ", 'g'),"n");
    r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
    r = r.replace(new RegExp("œ", 'g'),"oe");
    r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
    r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
    r = r.replace(new RegExp("\\W", 'g'),"");
    return r;
};