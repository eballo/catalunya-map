import config from "./catalunya-map-config";
import CatMap from "./catalunya-map";

$(document).ready(function () {
    let url = window.location.origin + config.url_json
    $.ajax({
        url: url,
        dataType: 'json',
        async: true,
        success: function (json) {
            const map = new CatMap(config, json);
            map.loadMapAndText();

            $("#map").show();
            $("#text").fadeIn(1000);
            $("#contentText").toggle(2000);
            $("#map").fadeIn(1000);
            $("#legend").fadeIn(1000);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Error - url: " + url);
        }
    });
})