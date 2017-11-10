(function(window, catmap) {
    $.ajax({
        url: catmap.URL_JSON,
        dataType: 'json',
        async: true,
        success: function(json) {
            //Create the map
            var map = catmap.create(catmap.MAP_OPTIONS, json);
            map.loadMapAndText();

            $("#map").fadeOut(1);
            $("#text").fadeIn(1000);
            $("#contentText").toggle(2000);
            $("#map").fadeIn(1000);
            $("#legend").fadeIn(1000);
        }
    });
}(window, window.Catmap));
