/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 12:38
 * To change this template use File | Settings | File Templates.
 */

var xpath = require('xpath'),
    dom = require('xmldom').DOMParser,
    Grau = require('../models/Grau'),
    Assignatura = require('../models/Assignatura'),
    Sessio = require('../models/Sessio');

var States = {
    INITIAL : 0,
    HAVE_SESSION : 1,
    HAVE_HOUR : 2,
    HAVE_TYPE : 3,
    HAVE_ASSIGNATURA : 4,
    END : -1
}

var SessionsProvider = module.exports = function(carreraCurs) {
    this.carreraCurs = carreraCurs;
    this.currentState = States.INITIAL;
    this.lastLine = "";
};

// Looks for a group, and makes use of the $linetype to search that will be like {0 => Aulagrup, 1 => Tipus}
SessionsProvider.prototype.GetGroupsFromLine = function(group_string) {
    // Look for a SXXX or PXXX as many as exists in the aulagrup line
    var sem_test = new RegExp("[Ss]{1}[0-9]{3}");
    var prac_test = new RegExp("[Pp]{1}[0-9]{3}");

    var groups = {};

    var sem = sem_test.exec(group_string);
    var prac = prac_test.exec(group_string);
    groups.sem = sem;
    groups.prac = prac;

    return groups;
};

// Looks for an aula, and makes use of the $linetype to search that will be like {0 => Aulagrup, 1 => Tipus}
SessionsProvider.prototype.GetAulesFromLine = function(aula_string) {
    // Look for an aula on the aulagroup line
    var aula_test = new RegExp("[0-9]{2}.[A-Za-z0-9][0-9]{2}"); // If line is like PXXX: XX.XXX or SXXX: XX.XXX or SXXX - XX.XXX is aulagrup => 1

    var aules = [];

    var aules = aula_test.exec(aula_string);

    return aules;
};

SessionsProvider.prototype.GetHoresInici = function(hora_string) {
    // Look for an aula on the aulagroup line
    var hora_test = new RegExp("([0-2]?[0-9][:|.][0-5][0-9])(?![0-9])"); // If line matches at least one hour XX:XX hora =>3

    var hores = hora_test.exec(hora_string);

    return hores[0];
};

SessionsProvider.prototype.FillSession = function(currentBlock) {
    var groups = this.GetGroupsFromLine(this.lastLine);
    var aules = this.GetAulesFromLine(this.lastLine);
    var self = this;

    if(groups.prac != null || groups.sem != null) {
        if(groups.sem != null) {
            groups.sem.forEach(function(group) {
                currentBlock.NewSessio(group, aules.toString());
            });
        }
        if(groups.prac != null) {
            groups.prac.forEach(function(group) {
                currentBlock.NewSessio(group, aules.toString());
            });
        }
    }
    else {
        currentBlock.NewSessio(this.carreraCurs.grup_teoria, aules.toString());
    }
};

SessionsProvider.prototype.FillHour = function(currentBlock) {
    //Tenim algo de hores
    return;
};

SessionsProvider.prototype.FillType = function(currentBlock) {
    //Tenim algo de tipus
    var tipus = this.lastLine;
    var regex = /(<([^>]+)>)/ig;
    var result = tipus.replace(regex, "");
    currentBlock.SetPropertyToAll("tipus", result);

    return;
};

SessionsProvider.prototype.FillAssignatura = function(currentBlock) {
    //Tenim el nom de l'assignatura
    var assignatura = this.lastLine;

    currentBlock.SetPropertyToAll("data", currentBlock.data.toUTCString());
    currentBlock.SetPropertyToAll("assignatura", assignatura);

    if(currentBlock.Finish) {
        currentBlock.Finish(null, currentBlock);
    }
    else {
        var curs = this.carreraCurs.curs;
        var grau = this.carreraCurs.grau;
        currentBlock.GetSessions().forEach(function(sessio) {
            var upsertData = sessio.toObject();

            // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
            delete upsertData._id;

            Sessio.findOneAndUpdate({aula: sessio.aula, data: sessio.data}, upsertData, { upsert: true }, function(err, doc) {
                Assignatura.findOneAndUpdate({nom: assignatura},{$addToSet: {sessions: doc}, curs: curs},{ upsert: true }, function(err, doc){
                    Grau.findOneAndUpdate({nom: grau.nom},{$addToSet: {assignatures: doc}},{ upsert: true }, function(err, doc){
                        if(err){
                            console.log(err);
                        }
                        else {
                            console.log("Sessio relacionada perfectament");
                        }
                    });
                });
            })
        });
    }

    this.currentState = States.INITIAL;
};

SessionsProvider.prototype.LineType = function(line) {
    var has_type = new RegExp("[ÀÁÈÉÍÏÒÓÚÜÑA-Z]{4,}"); // If line has at least 1 uppercase word is type => 0
    var has_aula = new RegExp("([0-9]{2}.[A-Za-z0-9][0-9]{2})"); // If line is like PXXX: XX.XXX or SXXX: XX.XXX or SXXX - XX.XXX is aulagrup => 1
    var has_assignatura = new RegExp("^((?:(?:[ÀÁÇÈÉÍÏÒÓÚÜÑA-Z]?[àáçèéíïòóúüña-z\\\'\\s]+)+)+[ÀÁÈÉÍÏÒÓÚÜÑA-Z]*)$"); // This regex is a miracle understandable. Sorry xD NO FUNCIONA DEL TOT, de moment detecta l'assignatura bé però només pot contenir una paraula en majuscula i al final.
    var has_hour = new RegExp("([0-2]?[0-9][:|.][0-5][0-9])(?![0-9])"); // If line matches at least one hour XX:XX hora =>3

    var result = line.match(has_type);
    if (result) {
        return States.HAVE_TYPE;
    }

    result = line.match(has_aula);
    if (result) {
        return States.HAVE_SESSION;
    }

    result = line.match(has_assignatura);
    if (result) {
        return States.HAVE_ASSIGNATURA;
    }

    result = line.match(has_hour);
    if (result) {
        return States.HAVE_HOUR;
    }

    return States.INITIAL;
};

SessionsProvider.prototype.ProcessState = function(currentBlock) {
    switch(this.currentState) {
        case States.HAVE_SESSION:
            this.FillSession(currentBlock);
            break;
        case States.HAVE_TYPE:
            this.FillType(currentBlock);
            break;
        case States.HAVE_HOUR:
            this.FillHour(currentBlock);
            break;
        case States.HAVE_ASSIGNATURA:
            this.FillAssignatura(currentBlock);
            break;
        default:
            break;
    }
}

SessionsProvider.prototype.StateMachine = function(line, currentBlock) {
    var lineType = this.LineType(line);
    this.lastLine = line;

    switch(this.currentState) {
        //Quan començem ens trobem en aquest estat.
        case States.INITIAL:
            switch(lineType) {
                case States.HAVE_SESSION:
                    this.currentState = States.HAVE_SESSION;
                    break;
                default:
                    this.currentState = States.INITIAL;
                    break;
            }
            break;
        case States.HAVE_SESSION:
            switch(lineType) {
                case States.HAVE_HOUR:
                    this.currentState = States.HAVE_HOUR;
                    break;
                case States.HAVE_TYPE:
                    this.currentState = States.HAVE_TYPE;
                    break;
                case States.HAVE_SESSION:
                    this.currentState = States.HAVE_SESSION;
                    break;
                case States.HAVE_ASSIGNATURA:
                    this.currentState = States.HAVE_ASSIGNATURA;
                    break;
                default:
                    console.log("FALLO: " + currentBlock.data.toString())
                    this.currentState = States.END;
                    break;
            }
            break;
        case States.HAVE_HOUR:
            switch(lineType) {
                case States.HAVE_SESSION:
                    this.currentState = States.HAVE_SESSION;
                    break;
                case States.HAVE_TYPE:
                    this.currentState = States.HAVE_TYPE;
                    break;
                default:
                    this.currentState = States.END;
                    break;
            }
            break;
        case States.HAVE_TYPE:
            switch(lineType) {
                case States.HAVE_SESSION:
                    this.currentState = States.HAVE_SESSION;
                    break;
                case States.HAVE_ASSIGNATURA:
                    this.currentState = States.HAVE_ASSIGNATURA;
                    break;
                default:
                    this.currentState = States.END;
                    break;
            }
            break;
        case States.HAVE_ASSIGNATURA:
            console.log("Hem acabat el bloc!");
            break;
        default:
            break;
    }
    this.ProcessState(currentBlock);
};

SessionsProvider.prototype.ParseBlock = function(currentBlock) {
    var doc = new dom().parseFromString(currentBlock.html.toString());
    var linies = xpath.select("//div/node()[name() != 'br']", doc);

    var self = this;

    //Parsejem la sessió de l'última linia a la primera
    linies.reverse().forEach(function(item, index) {

        //Netejem la lína d'informació que no volem
        var content = item.toString();
        content = content.replace(/(^\s*)|(\s*$)/gi,"");
        content = content.replace(/[ ]{2,}/gi," ");
        content = content.replace(/\n /,"\n");
        content = content.replace(/\n/,"");

        if(content != null && content != "") {
            //console.log(content);

            if(self.currentState != States.END) {
                self.StateMachine(content, currentBlock);
            }
            else {
                console.log("End of parsing");
            }
        }
    });
};