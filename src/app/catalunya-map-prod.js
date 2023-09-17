import config from "./config/catalunya-map-config-prod";
import CatMap from "./catalunya-map";

$(document).ready(function () {
    $.ajax({
        url: window.location.origin + config.url_json,
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
        }
    });
})