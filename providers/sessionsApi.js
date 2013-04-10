/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 12:38
 * To change this template use File | Settings | File Templates.
 */

var xpath = require('xpath'),
    dom = require('xmldom').DOMParser,
    Block = require('./block');

function SessionsApi() {
    this.currentBlock = new Block();
};

SessionsApi.prototype.states = {
    INITIAL : 0,
    HAVE_SESSION : 1,
    HAVE_HOUR : 2,
    HAVE_TYPE : 3,
    HAVE_ASSIGNATURA : 4,
    END : -1
}

SessionsApi.prototype.currentState = SessionsApi.prototype.states.INITIAL;
SessionsApi.prototype.lastLine = "";

// Looks for a group, and makes use of the $linetype to search that will be like {0 => Aulagrup, 1 => Tipus}
SessionsApi.prototype.getGroupsFromLine = function(group_string) {
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

SessionsApi.prototype.fillSession = function() {
    var groups = this.getGroupsFromLine(this.lastLine);

    var self = this;

    if(groups.prac != null || groups.prac != null) {
        if(groups.sem != null) {
            groups.sem.forEach(function(group) {
                self.currentBlock.newSessio();
                self.currentBlock.getCurrentSessio().grup = group;
            });
        }
        if(groups.prac != null) {
            groups.prac.forEach(function(group) {
                self.currentBlock.newSessio();
                self.currentBlock.getCurrentSessio().grup = group;
            });
        }
    }
    else {
        self.currentBlock.newSessio();
        self.currentBlock.getCurrentSessio().grup = group;
    }





    if(groups.prac == null && groups.sem == null) {

    }
};

SessionsApi.prototype.fillHour = function() {
    //Tenim algo de hores
    return;
};

SessionsApi.prototype.fillType = function() {
    //Tenim algo de tipus
    return;
};

SessionsApi.prototype.fillAssignatura = function() {
    //Tenim el nom de l'assignatura
    return;
};

SessionsApi.prototype.lineType = function(line) {
    var has_type = new RegExp("[ÀÁÈÉÍÏÒÓÚÜÑA-Z]{4,}"); // If line has at least 1 uppercase word is type => 0
    var has_aula = new RegExp("([0-9]{2}.[A-Za-z0-9][0-9]{2})"); // If line is like PXXX: XX.XXX or SXXX: XX.XXX or SXXX - XX.XXX is aulagrup => 1
    var has_assignatura = new RegExp("^((?:(?:[ÀÁÇÈÉÍÏÒÓÚÜÑA-Z]?[àáçèéíïòóúüña-z\\\'\\s]+)+)+[ÀÁÈÉÍÏÒÓÚÜÑA-Z]*)$"); // This regex is a miracle understandable. Sorry xD NO FUNCIONA DEL TOT, de moment detecta l'assignatura bé però només pot contenir una paraula en majuscula i al final.
    var has_hour = new RegExp("([0-2]?[0-9][:|.][0-5][0-9])(?![0-9])"); // If line matches at least one hour XX:XX hora =>3

    var result = line.match(has_type);
    if (result) {
        return this.states.HAVE_TYPE;
    }

    result = line.match(has_aula);
    if (result) {
        return this.states.HAVE_SESSION;
    }

    result = line.match(has_assignatura);
    if (result) {
        return this.states.HAVE_ASSIGNATURA;
    }

    result = line.match(has_hour);
    if (result) {
        return this.states.HAVE_HOUR;
    }

    return this.states.INITIAL;
};

SessionsApi.prototype.stateMachine = function(line) {
    var lineType = this.lineType(line);

    switch(this.currentState) {
        //Quan començem ens trobem en aquest estat.
        case this.states.INITIAL:
            switch(lineType) {
                case this.states.HAVE_SESSION:
                    this.currentState = this.states.HAVE_SESSION;
                    break;
                default:
                    this.currentState = this.states.INITIAL;
                    break;
            }
            break;
        case this.states.HAVE_SESSION:
            this.fillSession();
            switch(lineType) {
                case this.states.HAVE_HOUR:
                    this.currentState = this.states.HAVE_HOUR;
                    break;
                case this.states.HAVE_TYPE:
                    this.currentState = this.states.HAVE_TYPE;
                    break;
                default:
                    this.currentState = this.states.END;
                    break;
            }
            break;
        case this.states.HAVE_HOUR:
            this.fillHour();
            switch(lineType) {
                case Block.states.HAVE_SESSION:
                    this.currentState = Block.states.HAVE_SESSION;
                    break;
                default:
                    this.currentState = Block.states.END;
                    break;
            }
            break;
        case this.states.HAVE_TYPE:
            this.fillType();
            switch(lineType) {
                case this.states.HAVE_SESSION:
                    this.currentState = this.states.HAVE_SESSION;
                    break;
                case this.states.HAVE_ASSIGNATURA:
                    this.currentState = this.states.HAVE_ASSIGNATURA;
                    break;
                default:
                    this.currentState = this.states.END;
                    break;
            }
            break;
        case this.states.HAVE_ASSIGNATURA:
            this.fillAssignatura();
            this.currentState = this.states.INITIAL;
            console.log("Hem acabat el bloc!");
            break;
        default:
            break;
    }

    this.lastLine = line;
};

SessionsApi.prototype.parseSessio = function(sessio, setmana, dia, hora) {
    var doc = new dom().parseFromString(sessio.toString());
    var linies = xpath.select("//div/node()[name() != 'br']", doc);

    var self = this;

    //Parsejem la sessió de l'última linia a la primerae
    linies.reverse().forEach(function(item, index) {

        //Netejem la lína d'informació que no volem
        var content = item.toString();
        content = content.replace(/(^\s*)|(\s*$)/gi,"");
        content = content.replace(/[ ]{2,}/gi," ");
        content = content.replace(/\n /,"\n");
        content = content.replace(/\n/,"");

        if(content != null && content != "") {
            console.log(content);

            if(self.currentState != self.states.END) {
                self.stateMachine(content);
            }
            else {
                console.log("End of parsing");
            }
        }
    });
};

exports.SessionsApi = SessionsApi;