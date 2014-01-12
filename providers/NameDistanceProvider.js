var natural = require('natural');
var distance = require('distance');

function stringToArray(sentence) {
    var words = sentence.replace(/\b(?:a|de|del|per|i|en|pel|amb|sobre|la|les|el|[.,?!;()"'-])\b\s/gi, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .split(" ");

    return words;
}

var calculateDistance = function(string1, string2) {
    var longest = string1.length > string2.length ? string1.length : string2.length;
    var lev = 1 - (distance.levenshtein(string1, string2) / longest);

    string1 = stringToArray(string1);
    string2 = stringToArray(string2);

    var equals = {};

    string1.forEach(function (word) {
        if(!equals[word + "1"]) {
            string2.forEach(function (word2) {
                if(!equals[word2 + "2"]) {
                    if(distance.levenshtein(word, word2) < 3) {
                        equals[word2 + "2"] = true;
                        equals[word + "1"] = true;
                    }
                }
            });
        }
    });

    var total_words = string1.length > string2.length ? string1.length : string2.length;
    var equal_words = Object.keys(equals).length / 2;

    var success_percent = equal_words / total_words;
    var final_percent = (success_percent + lev) / 2;

    return final_percent;
}

var subjects_base;
var pushToDistanceDictionary = function(distance_dictionary, name, callback) {
    subjects_base.forEach(function(subject) {
        distance_dictionary.push({name: subject.name, distance: calculateDistance(subject.name, name), id: subject._id});
    });

    callback(distance_dictionary);
}

exports.DistanceDictionary = function(name, names_array, callback) {
    var distance_dictionary = [];

    if(names_array) {
        Object.keys(names_array).forEach(function(name_item) {
            distance_dictionary.push({name: name_item, distance: calculateDistance(AccentsTidy(name_item), AccentsTidy(name))});
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
        if(subject.distance > lower_distance) {
            lower_distance = subject.distance;
            current_match = subject;

        }
    });

    return {distance: lower_distance, name: current_match.name, id: current_match.id};
};

var AccentsTidy = function(s){
    var r=s.toLowerCase();
    r = r.replace(new RegExp("[àáâãäå]", 'g'),"a");
    r = r.replace(new RegExp("æ", 'g'),"ae");
    r = r.replace(new RegExp("ç", 'g'),"c");
    r = r.replace(new RegExp("[èéêë]", 'g'),"e");
    r = r.replace(new RegExp("[ìíî]", 'g'),"i");
    r = r.replace(new RegExp("ñ", 'g'),"n");
    r = r.replace(new RegExp("[òóôõö]", 'g'),"o");
    r = r.replace(new RegExp("œ", 'g'),"oe");
    r = r.replace(new RegExp("[ùúûü]", 'g'),"u");
    r = r.replace(new RegExp("[ýÿ]", 'g'),"y");
    return r;
};