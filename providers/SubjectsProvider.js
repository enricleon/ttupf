/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 2/05/13
 * Time: 18:40
 * To change this template use File | Settings | File Templates.
 */
var request = require('request');
var dom = require('xmldom').DOMParser;
var xpath = require('xpath');

var NameDistanceProvider = require('./NameDistanceProvider');

var Grade = require('../models/Grade');

var SubjectsProvider = module.exports = function() {
    this.base_urls = ["http://www.upf.edu/pra/"];
    this.subjects = {};
};

function html2xhtml(post_data, callback){
    var request = require('request');
    request.post({
        headers: {'content-type' : 'text/html'},
        url:     'http://www.it.uc3m.es/jaf/cgi-bin/html2xhtml.cgi',
        body:    post_data
    }, function(error, response, body){
        callback(error, body);
    });
}

SubjectsProvider.prototype.CleanLine = function(line) {
    var content = line.toString();
    content = content.replace(/(^\s*)|(\s*$)/gi,"");
    content = content.replace(/[ ]{2,}/gi," ");
    content = content.replace(/\n /," ");
    content = content.replace(/\n/,"");

    return content;
}

SubjectsProvider.prototype.UpdateSubjectsProgram = function(program, grade_code) {
    var me = this;

    html2xhtml(program, function(error, res) {
        var program_dom = new dom().parseFromString(res);
        var subjects = xpath.select("//html/body//descendant::div[@id='contenido']/descendant::ul//li[@class='sumari']", program_dom);

        subjects.forEach(function (item, index){
            var subject_item = new dom().parseFromString(item.toString());

            var dirty_code = xpath.select('/li/a/text()', subject_item);
            var dirty_name = xpath.select('/li/text()', subject_item);

            // entity type trim
            var subject_name = me.CleanLine(dirty_name.toString().replace(/\n[\s]*/gm,' ').replace(",","").replace("&nbsp;","").replace("&amp;","").replace("nbsp;", "").replace("amp;", ""));
            var subject_code = dirty_code.toString();

            var distance_dictionary = NameDistanceProvider.DistanceDictionary(subject_name, me.subjects);
            var lower_distance = NameDistanceProvider.LowerDistance(distance_dictionary);
            var name = subject_name;

            if(lower_distance.distance != -1 && lower_distance.distance >= 0.80) {
                name = lower_distance.name;
            }

            if(me.subjects[name]) {
                me.subjects[name].code.push(subject_code);
            }
            else {
                me.subjects[name] = {code: [subject_code]}
            }
        });

        Object.keys(me.subjects).forEach(function(name) {
            var subject = me.subjects[name];
            var Subject = require('../models/Subject');
            Subject.findOneAndUpdate({name: name}, {$addToSet: {code: { $each:  subject.code}}}, {upsert: true}, function(err, doc) {
                if(!err && doc) {
                    console.log("Assignatura guardada correctament");
                    Grade.findOneAndUpdate({code: grade_code},{$addToSet: {subjects: doc}},{ upsert: true }, function(err, grade){
                        if(err){
                            console.log(err);
                        }
                    });
                }
            });
        });
    });
};

SubjectsProvider.prototype.UpdateAllSubjects = function(grade_code) {

    var urls = new Array();
    this.base_urls.forEach(function(base_url) {
        urls.push(base_url + grade_code)
    });

    var me = this;

    urls.forEach(function(url) {
        request({
            uri: url,
            method: 'GET',
            encoding: 'binary'
        }, function (error, response, body){
            me.UpdateSubjectsProgram(body, grade_code);
        });
    });
};





