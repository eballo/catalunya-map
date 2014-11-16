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

    var mapWidth=425;
    var mapHeight=400;

    var obj;

    var debug = false;

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
            resizeMap(paper);   
        }

    }

    function resizeMap(paper){
        paper.changeSize(mapWidth, mapHeight, true, false);

        $(".map").css({
            'width': mapWidth + 'px',
            'height': mapHeight + 'px'
        });

        $(".mapWrapper").css({
            'width': mapWidth + 'px',
            'height': mapHeight + 'px'
        });
    }

    function responsiveResize(){

        winWidth = win.width();
        
        if (winWidth >= 960) {
            mapWidth = 700;
            mapHeight = 800;
            paper.scaleAll(1.5);
            resizeMap(paper);
            
        }
        else if (winWidth < 960 && winWidth >= 768) {
            mapWidth =  425;
            mapHeight = mapWidth/ratio;
            paper.scaleAll(1);
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

        showValues();   
    }

    function showValues(){
        if(debug){
            $("#debugInfo").html("Win Width: " + winWidth + " Map with: " + mapWidth + " Map Height: " + mapHeight + " Ratio: " + ratio);
        }
    }

    function loadMapAndText() {

        paper = new ScaleRaphael('map', mapWidth, mapHeight);
        
        // scale 1.4
        paper.scaleAll(1.5);

        oMapWidth = mapWidth;
        ratio = mapWidth/mapHeight;

        win = $(window);
        winWidth = win.width();

        createMap(paper);
    }

    window.onload  = loadMapAndText();

});