/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 22/05/13
 * Time: 18:03
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function() {
    $(".profile_tab").click(function(e) {
        $(this).parents(".nav-pills").children("li").each(function() {
            $(this).removeClass("active");
        });
        $(this).parents("li").attr("class", "active");
        switch($(this).attr("id")) {
            case "enrollments_tab":
                $("#calendar").hide();
                $("#espai_aula").hide();
                $("#enrollments").show();
                break;
            case "calendar_tab":
                $("#calendar").show();
                $("#espai_aula").hide();
                $("#enrollments").hide();
                break;
            case "espai_aula_tab":
                $("#calendar").hide();
                $("#enrollments").hide();
                $("#espai_aula").show();
                break;
            default:
                break;
        }
    });
});