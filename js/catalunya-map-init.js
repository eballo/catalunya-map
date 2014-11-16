$(function () {

    var colorIn = '#d1eafe';
    var colorOut = '#fff';

    var attributes = {
        fill : colorOut,
        stroke : '#abacae',
        'stroke-width' : 1,
        'stroke-linejoin' : 'round',
        'font-family': 'Verdana',
        'font-size': '19px',
        'font-weight': 'bold',
        'z-index' : 10
    };

    var arr_comarca = new Array();
    var arr_objects = new Array();

    var responsive = true;

    var paper;
    var winWidth;
    var win;

    var mapWidth;
    var mapHeight;

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

        if(responsive){
            responsiveResize();
            $(window).resize(function() {
                responsiveResize();
            });
        }
        else{
            resizeMap(r);   
        }

    }

    function resizeMap(paper){
        paper.changeSize(mapWidth, mapHeight, true, false);

        $(".map").css({
            'width': mapWidth + 'px',
            'height': mapHeight + 'px'
        });
    }

    function responsiveResize(){

        winWidth = win.width();
        
        if (winWidth >= 960) {
            mapWidth = oMapWidth;
            mapHeight = mapWidth/ratio;
            resizeMap(paper);
        }
        else if (winWidth < 960 && winWidth >= 768) {
            mapWidth =  425;
            mapHeight = mapWidth/ratio;
            resizeMap(paper);
        }
        else if (winWidth < 480) {
            mapWidth = 225;
            mapHeight = mapWidth/ratio;
            resizeMap(paper);

        }
        else if (winWidth < 768 && winWidth > 480) {
            mapWidth = 425;
            mapHeight = mapWidth/ratio;
            resizeMap(paper);
        }           
    }

    function loadMapAndText() {

        paper = new ScaleRaphael('map', 425, 400);

        oMapWidth = mapWidth;
        ratio = mapWidth/mapHeight;

        win = $(window);
        winWidth = win.width();

        createMap(paper);
    }

    window.onload  = loadMapAndText();

});