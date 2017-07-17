$.ajax({
    url: "js/catalunya-map-path.json",
    dataType: 'json',
    async: false,
    success: function(json){
				(function(window, catmap) {

					//Create the map
					var map = catmap.create(catmap.MAP_OPTIONS, json);
					map.loadMapAndText();

				}(window, window.Catmap));
    }
});
