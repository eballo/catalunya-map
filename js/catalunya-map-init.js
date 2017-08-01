$.ajax({
    url: "js/catalunya-map-path.json",
    dataType: 'json',
    async: true,
    success: function(json){
				(function(window, catmap) {

					//Create the map
					var map = catmap.create(catmap.MAP_OPTIONS, json);
					map.loadMapAndText();

          var comarca = catmap.create(catmap.MAP_OPTIONS, json);
          comarca.getComarca(13);

				}(window, window.Catmap));
    }
});
