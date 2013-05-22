/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 13/05/13
 * Time: 23:09
 * To change this template use File | Settings | File Templates.
 */
var xpath = require('xpath')
var dom = require('xmldom').DOMParser;
var GradeCourse = require('./models/GradeCourse');
var Course = require('./models/Course');
var Grade = require('./models/Grade');
var Period = require('./models/Period');

var Config = module.exports = function() {
    this.grades = {};
    this.courses = {};
    this.periods = {};
    this.functions = [];
    this.currentFunction = 0;
};

// Function to read the configuration file
Config.prototype.LoadConfig = function (config){
    var doc = new dom().parseFromString(config);

    var me = this;

    me.functions.push(function() {
        var courses = xpath.select("/configuration/courses//course", doc);
        courses.forEach(function(item, index) {
            me.LoadCourse(item, courses.length - index);
        });
    });

    me.functions.push(function() {
        var grades = xpath.select("/configuration/grades//grade", doc);
        grades.forEach(function(item, index) {
            me.LoadGrade(item, grades.length - index);
        });
    });

    me.functions.push(function() {
        var periods = xpath.select("/configuration/periods//period", doc);
        periods.forEach(function(item, index) {
            me.LoadPeriod(item, periods.length - index);
        });
    });

    me.functions.push(function() {
        var course_grades = xpath.select("/configuration/course_grades//course_grade", doc);
        course_grades.forEach(function(item, index) {
            me.LoadCourseGrade(item, course_grades.length - index);
        });
    });

    me.functions[me.currentFunction]();
};

Config.prototype.LoadCourse = function(course, end) {
    var doc = new dom().parseFromString(course.toString());

    var name = xpath.select("/course/name/text()", doc).toString();
    var index = xpath.select("/course/index/text()", doc).toString();
    var number = xpath.select("/course/number/text()", doc).toString();

    var me = this;
    Course.findOneAndUpdate({name: name}, {number: number}, {upsert: true}, function(err, doc) {
        if(!err && doc) {
            me.courses[index] = doc;
        }
        if(end == 1) {
            me.currentFunction += 1;
            me.functions[me.currentFunction]();
        }
    });
};

Config.prototype.LoadGrade = function(grade, end) {
    var doc = new dom().parseFromString(grade.toString());

    var index = xpath.select("/grade/index/text()", doc).toString();
    var name = xpath.select("/grade/name/text()", doc).toString();
    var code = xpath.select("/grade/code/text()", doc).toString();

    var me = this;
    Grade.findOneAndUpdate({code: code}, {name: name}, {upsert: true}, function(err, doc) {
        if(!err && doc) {
            me.grades[index] = doc;
        }
        if(end == 1) {
            me.currentFunction += 1;
            me.functions[me.currentFunction]();
        }
    });
};

Config.prototype.LoadPeriod = function(period, end) {
    var doc = new dom().parseFromString(period.toString());

    var year = xpath.select("/period/year/text()", doc).toString();
    var quarter = xpath.select("/period/quarter/text()", doc).toString();
    var index = xpath.select("/period/index/text()", doc).toString();

    var me = this;
    Period.findOneAndUpdate({year: year, quarter: quarter}, {}, {upsert: true}, function(err, doc) {
        if(!err && doc) {
            me.periods[index] = doc;
        }
        if(end == 1) {
            me.currentFunction += 1;
            me.functions[me.currentFunction]();
        }
    });
};

Config.prototype.LoadCourseGrade = function(course_grade, end) {
    var doc = new dom().parseFromString(course_grade.toString());

    var grade_index = xpath.select("/course_grade/grade/text()", doc).toString();
    var course_index = xpath.select("/course_grade/course/text()", doc).toString();
    var period_index = xpath.select("/course_grade/period/text()", doc).toString();

    var timetable_url = xpath.select("/course_grade/timetable_url/text()", doc).toString();
    var theory_group = xpath.select("/course_grade/theory_group/text()", doc).toString();
    var grade = this.grades[grade_index];
    var course = this.courses[course_index];
    var period = this.periods[period_index];

    GradeCourse.findOneAndUpdate({timetable_url: timetable_url}, {
        theory_group: theory_group,
        grade: grade,
        course: course,
        period: period
    }, {upsert: true}, function(err, doc) {
        if(!err && doc) {
            console.log(timetable_url + ": Success!");
        }
        else {
            console.log(err);
        }
    });

};