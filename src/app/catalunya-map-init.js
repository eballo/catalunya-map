import CatMap from "./catalunya-map";
import config from "./catalunya-map-config"

$(document).ready(function () {
    $.ajax({
        url: window.location.origin + "/js/catalunya-map-path.json",
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
