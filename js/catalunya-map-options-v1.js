//---------------------------
// Configuration values
//---------------------------

(function(window, catmap) {

catmap.MAP_OPTIONS = {

			colorIn  : '#d1eafe',    //color when the mouse is over
		  colorOut : '#fff',       //color when the mouse is not over

	    scale    : 0.8,          //scale value

	    mapInitWidth  : 825,     //initial map width
	    mapInitHeight : 800,     //initial map height

	    textInitWidth : 250,     //initial text width

	    mapWidth  : 825,  		   //map width variable
	    mapHeight : 800, 		     //map height variable

	    debug      : false,       //enable/disable debug mode
	    responsive : true,       //enable/disable responsive funcionality
	    useText    : true,       ////enable/disable list text comarques

	    onClick    : false,      //enable/disable onclick open link
	    newWindow  : false,      //enable/disable open a page in a new window for onClick functionality

	    comarcaAttr : {              //comarca style configuration
	        fill : '#fff',			     //white
 				  stroke : '#abacae',      //soft grey
	        'stroke-width' : 0.8,
	        'stroke-linejoin' : 'round',
	        'font-family': 'Verdana',
	        'font-size': '19px',
	        'font-weight': 'bold',
	        'cursor': 'pointer',
	        'z-index' : 10
	    },

	    nomComcarcaAttr_in : {      //nom comarca style configuration for hover in
				  fill : '#3300FF',       //color for the text of comarca (dark blue)
				  stroke : '#000000',     //black
	        'stroke-width' : 0.4,
	        'font-family': 'Verdana',
	        'font-size': '12px',
	        'font-weight': 'bold',
	        'cursor': 'pointer',
	        'z-index' : 20
	    },

	    nomComcarcaAttr_out : {      //nom comarca style configuration for hover out
	        fill : '#686868',        // grey
	        'stroke-width' : 0,
	        'font-family': 'Verdana',
	        'font-size': '12px',
	        'font-weight': 'bold',
	        'cursor': 'pointer',
	        'z-index' : 20
	    },

	    nomCapitalAttr : {       //nom capital comarca style configuration
	       fill : '#FF9900',     //orange
	       "font-family": "Arial, sans-serif",
	       "font-size": "10px",
	       'cursor': 'pointer',
	       'z-index': 30
	   }
	};

}(window, window.Catmap || (window.Catmap = {}) ));
