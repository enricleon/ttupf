/**
 * Created with JetBrains WebStorm.
 * User: Enric
 * Date: 30/12/13
 * Time: 10:47
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
    $(".timestamp_start_utc").each(function() {
        var utc_start_string = $(this).html();
        var utc_start_date = new Date(utc_start_string);
        $(this).html(utc_start_date.getHours() + ":" + utc_start_date.getMinutes());
    });
});