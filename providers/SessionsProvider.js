/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 19/02/13
 * Time: 12:38
 * To change this template use File | Settings | File Templates.
 */

var xpath = require('xpath'),
    dom = require('xmldom').DOMParser,
    Grade = require('../models/Grade'),
    Subject = require('../models/Subject'),
    Session = require('../models/Session');

var NameDistanceProvider = require('./NameDistanceProvider');

var States = {
    INITIAL : 0,
    HAVE_SESSION : 1,
    HAVE_HOUR : 2,
    HAVE_TYPE : 3,
    HAVE_SUBJECT : 4,
    END : -1
}

var SessionsProvider = module.exports = function(gradeCourse) {
    this.gradeCourse = gradeCourse;
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

// Looks for an classroom, and makes use of the $linetype to search that will be like {0 => Aulagrup, 1 => Tipus}
SessionsProvider.prototype.GetClassroomsFromLine = function(classroom_string) {
    // Look for an classroom on the aulagroup line
    var classroom_test = new RegExp("[0-9]{2}.[A-Za-z0-9][0-9]{2}"); // If line is like PXXX: XX.XXX or SXXX: XX.XXX or SXXX - XX.XXX is aulagrup => 1

    var classrooms = [];

    var classrooms = classroom_test.exec(classroom_string);

    return classrooms;
};

SessionsProvider.prototype.GetInitialTime = function(hour_string) {
    // Look for an classroom on the aulagroup line
    var hour_test = new RegExp("([0-2]?[0-9][:|.][0-5][0-9])(?![0-9])"); // If line matches at least one hour XX:XX hora =>3

    var hours = hour_test.exec(hour_string);

    return hours[0];
};

SessionsProvider.prototype.FillSession = function(currentBlock) {
    var groups = this.GetGroupsFromLine(this.lastLine);
    var classrooms = this.GetClassroomsFromLine(this.lastLine);
    var self = this;

    if(groups.prac != null || groups.sem != null) {
        if(groups.sem != null) {
            groups.sem.forEach(function(group) {
                currentBlock.NewSession(group, classrooms.toString());
            });
        }
        if(groups.prac != null) {
            groups.prac.forEach(function(group) {
                currentBlock.NewSession(group, classrooms.toString());
            });
        }
    }
    else {
        currentBlock.NewSession(this.gradeCourse.theory_group, classrooms.toString());
    }
};

SessionsProvider.prototype.FillHour = function(currentBlock) {
    //Tenim algo de hores
    return;
};

SessionsProvider.prototype.FillType = function(currentBlock) {
    //Tenim algo de type
    var type = this.lastLine;
    var regex = /(<([^>]+)>)/ig;
    var result = type.replace(regex, "");
    currentBlock.SetPropertyToAll("type", result);

    return;
};

SessionsProvider.prototype.FillSubject = function(currentBlock) {
    // Whe have now the subject's name.
    var subject_name = this.lastLine;

    currentBlock.SetPropertyToAll("timestamp_start", currentBlock.data.toUTCString());

    if(currentBlock.Finish) {
        currentBlock.SetPropertyToAll("subject", subject_name);
        currentBlock.Finish(null, currentBlock);
    }
    else {
        var course = this.gradeCourse.course;
        var grade = this.gradeCourse.grade;

        var block_sessions = currentBlock.GetSessions();
        currentBlock.Reset();
        block_sessions.forEach(function(session) {
            var upsertData = session.toObject();

            // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
            delete upsertData._id;

            Session.findOneAndUpdate({classroom: session.classroom, timestamp_start: session.timestamp_start}, upsertData, { upsert: true }, function(err, session_doc) {
                if(!err && session_doc) {
                    NameDistanceProvider.DistanceDictionary(subject_name, null, function(distance_dictionary) {
                        var lower_distance = NameDistanceProvider.LowerDistance(distance_dictionary);
                        var saveGrade = false;

                        if(lower_distance.distance >= 12) {
                            lower_distance.name = subject_name;
                            saveGrade = true;
                        }
                        Subject.findOneAndUpdate({name: lower_distance.name},{$addToSet: {sessions: session_doc}, course: course},{ upsert: true }, function(err, subject_doc){
                            if(err){
                                console.log(err);
                            }
                            else {
                                session_doc.subject = lower_distance.id;
                                session_doc.save();
                                if(saveGrade){
                                    Grade.findOneAndUpdate(grade,{$addToSet: {subjects: subject_doc}},{ upsert: true }, function(err, doc_grade){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
                else {
                    console.log(err);
                }
            });
        });
    }

    this.currentState = States.INITIAL;
};

SessionsProvider.prototype.LineType = function(line) {
    var has_type = new RegExp("[ÀÁÈÉÍÏÒÓÚÜÑA-Z]{4,}"); // If line has at least 1 uppercase word is type => 0
    var has_classroom = new RegExp("([0-9]{2}.[A-Za-z0-9][0-9]{2})"); // If line is like PXXX: XX.XXX or SXXX: XX.XXX or SXXX - XX.XXX is aulagrup => 1
    var has_subject = new RegExp("^((?:(?:[ÀÁÇÈÉÍÏÒÓÚÜÑA-Z]?[àáçèéíïòóúüña-z\\'\\s\\.\\-·]+)+)+[ÀÁÈÉÍÏÒÓÚÜÑA-Z0-9]*)$"); // This regex is a miracle understandable. Sorry xD NO FUNCIONA DEL TOT, de moment detecta l'subject bé però només pot contenir una paraula en majuscula i al final.
    var has_hour = new RegExp("([0-2]?[0-9][:|.][0-5][0-9])(?![0-9])"); // If line matches at least one hour XX:XX hora =>3

    var result = line.match(has_type);
    if (result) {
        return States.HAVE_TYPE;
    }

    result = line.match(has_classroom);
    if (result) {
        return States.HAVE_SESSION;
    }

    result = line.match(has_subject);
    if (result) {
        return States.HAVE_SUBJECT;
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
        case States.HAVE_SUBJECT:
            this.FillSubject(currentBlock);
            break;
        default:
            break;
    }
}

SessionsProvider.prototype.StateMachine = function(line, currentBlock) {
    var lineType = this.LineType(line);
    this.lastLine = line;

    switch(this.currentState) {
        // We start here
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
                case States.HAVE_SUBJECT:
                    this.currentState = States.HAVE_SUBJECT;
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
                case States.HAVE_SUBJECT:
                    this.currentState = States.HAVE_SUBJECT;
                    break;
                default:
                    this.currentState = States.END;
                    break;
            }
            break;
        case States.HAVE_SUBJECT:
            console.log("Block ended!");
            break;
        default:
            break;
    }
    this.ProcessState(currentBlock);
};

SessionsProvider.prototype.ParseBlock = function(currentBlock) {
    var doc = new dom().parseFromString(currentBlock.html.toString());
    var lines = xpath.select("//div/node()[name() != 'br']", doc);

    var self = this;

    //Parsejem la sessió de l'última linia a la primera
    lines.reverse().forEach(function(item, index) {

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
                self.currentState = States.INITIAL;
            }
        }
    });
};