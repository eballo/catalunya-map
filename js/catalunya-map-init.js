$(function () {

    var colorIn = '#d1eafe';
    var colorOut = '#fff';

    var attributes = {
        fill : colorOut,
        stroke : '#abacae',
        'stroke-width' : 1,
        'stroke-linejoin' : 'round',
        'z-index' : 10
    };

    var arr_comarca = new Array();
    var arr_objects = new Array();

    var obj;

    function createMap(paper) {

        for (var comarca in mappaths) {

            // raphael object
            obj = paper.path(mappaths[comarca].path);

            // Set the atributes to the object map
            obj.attr(attributes);

            // creation the array objects, capital and comarca
            arr_objects[comarca] = obj;
            arr_comarca[obj.id] = comarca;

            // Change the color of each comarca animation Hover event
            obj.hover(function() {
                // when we are hover...
                this.animate({
                    fill : colorIn
                }, 100);

            }, function() {
                // when we are not hover...
                this.animate({
                    fill : attributes.fill
                }, 100);
            });
        }
    }

    function loadMapAndText() {
        var paper = Raphael('map', 425, 400);
        createMap(paper);
    }

    window.onload  = loadMapAndText();

});