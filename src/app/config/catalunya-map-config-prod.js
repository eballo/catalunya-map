const MAP_CONFIG = {

    url_json : "/wp-content/plugins/catalunya-medieval-plugins/plugins/refreshMap/pages/js/catalunya-map-path.json",

    debug: false,        // enable/disable debug mode
    responsive: true,    // enable/disable responsive funcionality
    useText: true,       // enable/disable list text comarques
    useListText: true,  // enable/disable comarcas list text
    button: false,       // enable/disable button functionality
    onClick: false,      // enable/disable onclick open link
    newWindow: false,    // enable/disable open a page in a new window for onClick functionality

    colorIn: '#fee8cb',  //color when the mouse is over
    colorOut: '#fff',    //color when the mouse is not over

    scale: 0.8,          //scale value

    mapInitWidth: 825,   //initial map width
    mapInitHeight: 800,  //initial map height

    textInitWidth: 250,  //initial text width

    mapWidth: 825,       //map width variable
    mapHeight: 800,      //map height variable

    // --------- Comarca style configuration
    comarcaAttr: {
        'fill': '#fff',
        'stroke': '#c7ab89', //color for the limit line of comarca (clear brown)
        'stroke-width': 0.8,
        'stroke-linejoin': 'round',
        'font-family': 'Droid Sans,Verdana',
        'font-size': '19px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 10
    },

    // --------- Nom comarca style configuration for hover in
    nomComcarcaAttr_in: {
        'fill': '#a07a49',      // color for the text of comarca (dark brown)
        'stroke': '#000000',    // black
        'stroke-width': 0.4,
        'font-family': 'Droid Sans,Verdana',
        'font-size': '14px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 20
    },

    // --------- Nom comarca style configuration for hover out
    nomComcarcaAttr_out: {
        'fill': '#a07a49',
        'stroke-width': 0,
        'font-family': 'Droid Sans,Verdana',
        'font-size': '14px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 20
    },

    // --------- Nom capital comarca style configuration
    nomCapitalAttr: {
        'fill': '#FF9900', //orange
        'font-family': 'Droid Sans, Arial, sans-serif',
        'font-size': '12px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 30
    }
};

export default MAP_CONFIG;


