/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 22/05/13
 * Time: 0:52
 * To change this template use File | Settings | File Templates.
 */

var ok_enrollment_click = function() {
    $(this).hide();

    var current_enrollment = $(this).parents("tr");
    var current_enrollment_id = $(current_enrollment).find(".enrollment_id").attr("value");
    var ce_seminar_group = $(current_enrollment).find(".editable[name=\"seminar_group\"]").attr("value");
    var ce_practicum_group = $(current_enrollment).find(".editable[name=\"practicum_group\"]").attr("value");

    $(".edit_enrollment").each(function(){
        $(this).show();
    });

    $(current_enrollment).find(".editable").each(function(){
        $(this).attr("disabled", "disabled");
    });

    $(current_enrollment).css("background-color", "rgb(255, 255, 255)");

    $.ajax({
        url: "/api/enrollments",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ enrollment: current_enrollment_id, seminar_group: ce_seminar_group, practicum_group: ce_practicum_group}),
        dataType: 'json',
        success: function(response) {
            console.log("success: " + JSON.stringify(response));
        },
        failure: function(response) {
            console.log("failure");
        },
        error: function() {
            console.log("error");
        },
        complete: function() {
            console.log("complete");
        }
    });
};

var edit_enrollment_click = function() {
    $(".edit_enrollment").each(function(){
        $(this).hide();
    });
    var current_enrollment = $(this).parents("tr");
    $(current_enrollment).find(".editable").each(function(){
        $(this).removeAttr("disabled");
    });

    var ok_enrollment = $(current_enrollment).find(".ok_enrollment");
    ok_enrollment.show();
    $(this).parents("tr").css("background-color", "rgb(245, 245, 245)");
};

$(document).ready(function() {
    $(".edit_enrollment").on("click", edit_enrollment_click);
    $(".ok_enrollment").on("click", ok_enrollment_click);
});