(function(window, catmap) {
  $.ajax({
      url: catmap.URL_JSON,
      dataType: 'json',
      async: false,
      success: function(json){
  					//Create the map
  					var map = catmap.create(catmap.MAP_OPTIONS, json);
  					map.loadMapAndText();
      }
  });
}(window, window.Catmap));
