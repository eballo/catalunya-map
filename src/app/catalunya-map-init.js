import catmap from "./catalunya-map";

$(document).ready(function () {
    $.ajax({
        url: window.location.origin + catmap.URL_JSON,
        dataType: 'json',
        async: true,
        success: function (json) {
            //Create the map
            var map = catmap.create(catmap.MAP_OPTIONS, json);
            map.loadMapAndText();

            $("#map").show();
            $("#text").fadeIn(1000);
            $("#contentText").toggle(2000);
            $("#map").fadeIn(1000);
            $("#legend").fadeIn(1000);
        }
    });
})
