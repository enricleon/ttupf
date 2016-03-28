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
var async = require('async');

var Config = module.exports = function() {
    this.production = true;
    this.dbUri = this.production ? 'mongodb://ttupfadmin:L_1i2o9n2@ds027748.mlab.com:27748/ttupf_mongolab' : 'localhost:27017/ttupf';
    this.dbOptions = {
        server:{
            auto_reconnect: true,
                poolSize: 10,
                socketOptions:{
                keepAlive: 1
            }
        },
        db: {
            numberOfRetries: 10,
                retryMiliSeconds: 1000
        }
    };
};

// Function to read the configuration file
Config.prototype.LoadConfig = function (config){
    var doc = new dom().parseFromString(config);

    var me = this;

    async.waterfall([
        function(callback) {
            var courses = xpath.select("/configuration/courses//course", doc);
            async.map(courses, me.LoadCourse, function(err, real_courses) {
                callback(null, real_courses);
            });
        },
        function(real_courses, callback) {
            var grades = xpath.select("/configuration/grades//grade", doc);
            async.map(grades, me.LoadGrade, function(err, real_grades) {
                callback(null, real_grades, real_courses);
            });
        },
        function(real_grades, real_courses, callback) {
            var periods = xpath.select("/configuration/periods//period", doc);
            async.map(periods, me.LoadPeriod, function(err, real_periods) {
                callback(null, real_periods, real_grades, real_courses);
            });
        },
        function(real_periods, real_grades, real_courses, callback) {
            var course_grades = xpath.select("/configuration/course_grades//course_grade", doc);
            async.map(course_grades, function(course_grade, finish) {
                me.LoadCourseGrade(course_grade, finish, real_periods, real_grades, real_courses);
            }, callback);
        }
    ], function() {
        console.log("Ready!");
    });
};

Config.prototype.LoadCourse = function(course, callback) {
    var doc = new dom().parseFromString(course.toString());

    var name = xpath.select("/course/name/text()", doc).toString();
    var index = xpath.select("/course/index/text()", doc).toString();
    var number = xpath.select("/course/number/text()", doc).toString();

    Course.findOneAndUpdate({name: name}, {number: number}, {upsert: true}, function(err, doc) {
        async.nextTick(function(){
            if(!err && doc) {
                doc.internal_index = index;
                callback(null, doc);
            }
            else{
                callback(null);
            }
        });
    });
};

Config.prototype.LoadGrade = function(grade, callback) {
    var doc = new dom().parseFromString(grade.toString());

    var index = xpath.select("/grade/index/text()", doc).toString();
    var name = xpath.select("/grade/name/text()", doc).toString();
    var code = xpath.select("/grade/code/text()", doc).toString();

    Grade.findOneAndUpdate({code: code}, {name: name}, {upsert: true}, function(err, doc) {
        async.nextTick(function(){
            if(!err && doc) {
                doc.internal_index = index;
                callback(null, doc);
            }
            else{
                callback(null);
            }
        });
    });
};

Config.prototype.LoadPeriod = function(period, callback) {
    var doc = new dom().parseFromString(period.toString());

    var year = xpath.select("/period/year/text()", doc).toString();
    var quarter = xpath.select("/period/quarter/text()", doc).toString();
    var index = xpath.select("/period/index/text()", doc).toString();

    Period.findOneAndUpdate({year: year, quarter: quarter}, {}, {upsert: true}, function(err, doc) {
        async.nextTick(function(){
            if(!err && doc) {
                doc.internal_index = index;
                callback(null, doc);
            }
            else{
                callback(null);
            }
        });
    });
};

Config.prototype.LoadCourseGrade = function(course_grade, callback, real_periods, real_grades, real_courses) {
    async.nextTick(function(){
        var doc = new dom().parseFromString(course_grade.toString());

        var grade_index = xpath.select("/course_grade/grade/text()", doc).toString();
        var course_index = xpath.select("/course_grade/course/text()", doc).toString();
        var period_index = xpath.select("/course_grade/period/text()", doc).toString();

        var timetable_url = xpath.select("/course_grade/timetable_url/text()", doc).toString();
        var theory_group = xpath.select("/course_grade/theory_group/text()", doc).toString();

        async.waterfall([
            function(callback) {
                async.detect(real_grades, function(item, finish) {
                    if(item.internal_index == grade_index) {
                        finish(true);
                    }
                }, function(grade){
                    callback(null, grade);
                });
            },
            function(grade, callback) {
                async.detect(real_courses, function(item, finish) {
                    if(item.internal_index == course_index) {
                        finish(true);
                    }
                }, function(course){
                    callback(null, course, grade);
                });
            },
            function(course, grade, callback) {
                async.detect(real_periods, function(item, finish) {
                    if(item.internal_index == period_index) {
                        finish(true);
                    }
                }, function(period){
                    callback(null, period, course, grade);
                });
            },
            function(period, course, grade, callback) {
                GradeCourse.findOneAndUpdate({timetable_url: timetable_url}, {
                    theory_group: theory_group,
                    grade: grade,
                    course: course,
                    period: period
                }, {upsert: true}, function(err, doc) {
                    async.nextTick(function(){
                        callback(null);
                    });
                });
            }
        ],
        function() {
            callback();
        });
    });
};