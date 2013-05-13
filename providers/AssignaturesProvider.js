/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 2/05/13
 * Time: 18:40
 * To change this template use File | Settings | File Templates.
 */
var request = require('request');
var dom = require('xmldom').DOMParser;
var tidy = require('htmltidy').tidy;
var xpath = require('xpath');

var Encoder = require('node-html-encoder').Encoder;

var AssignaturesProvider = module.exports = function(codi_grau) {
    var base_url = "http://www.upf.edu/pra/";
    var base_url_es = "http://www.upf.edu/es/pra/";
    var base_url_en = "http://www.upf.edu/en/pra/";
    /*this.url = base_url + codi_grau;
    this.urlEs = base_url_es + codi_grau;
    this.urlEn = base_url_en + codi_grau;*/
    this.urls = new Array();
    this.urls[0] = base_url + codi_grau;
    this.urls[1] = base_url_es + codi_grau;
    this.urls[2] = base_url_en + codi_grau;
};

AssignaturesProvider.prototype.ParseCodiByName = function(callback, nom, body) {
    tidy(body,function(err, res){
        if(!err){
            var document = new dom().parseFromString(res);
            var assignaturesParsed = xpath.select("//html/body//descendant::div[@id='contenido']/descendant::ul//li[@class='sumari']", document);
            assignaturesParsed.forEach(function (item, index){
                var assig_element = new dom().parseFromString(item.toString());
                var codi_assig_element = xpath.select('/li/a/text()',assig_element);
                var nom_assig_element = xpath.select('/li/text()',assig_element);

                // entity type encoder
                var encoder = new Encoder('entity');
                var nom_assig_parsed = encoder.htmlDecode(nom_assig_element.toString()).replace("&nbsp;","");
                var codi_assig_parsed = codi_assig_element.toString();
                console.log(codi_assig_element.toString()+": "+nom_assig_parsed);

                if(nom_assig_parsed == nom){
                    callback(codi_assig_parsed);
                }
            });
        } else{
            console.log(err);
        }
    });
}
//
AssignaturesProvider.prototype.FindCodiAssignaturaByName = function(callback, nom) {
    var me = this;
    //while (me.){
        request({
            uri: this.urls[0],
            method: 'GET',
            encoding: 'binary'
        }, function (error, response, body){
            //console.log(body);//parse this to get the code of subject
            me.ParseCodiByName(callback, nom, body)
        });
    //}
    //callback();
};







