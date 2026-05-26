export function stringToBoolean(string) {
    return string.toLowerCase() === "false" ? false : Boolean(string);
}

const MAP_CONFIG = {

    comarquesJsonUrl: (typeof catalunyaMapConfig !== 'undefined' && catalunyaMapConfig.comarquesJsonUrl)
        ? catalunyaMapConfig.comarquesJsonUrl
        : '',

    // Needed to do the total calculation
    markersJsonUrl: (typeof catalunyaMapConfig !== 'undefined' && catalunyaMapConfig.markersJsonUrl)
        ? catalunyaMapConfig.markersJsonUrl
        : '',

    responsive: stringToBoolean(process.env.RESPONSIVE ?? 'true'),
    useText: stringToBoolean(process.env.USE_TEXT ?? 'true'),
    useListText: stringToBoolean(process.env.USE_LIST_TEXT ?? 'false'),
    button: stringToBoolean(process.env.BUTTON ?? 'false'),
    onClick: stringToBoolean(process.env.ON_CLICK ?? 'false'),
    newWindow: stringToBoolean(process.env.NEW_WINDOW ?? 'false'),

    colorIn: process.env.COLOR_IN ?? '#fee8cb',
    colorOut: process.env.COLOR_OUT ?? '#fff',

    scale: parseFloat(process.env.SCALE ?? '0.8'),

    mapInitWidth: parseInt(process.env.MAP_INIT_WIDTH ?? '825'),
    mapInitHeight: parseInt(process.env.MAP_INIT_HEIGHT ?? '800'),
    textInitWidth: parseInt(process.env.TEXT_INIT_WIDTH ?? '280'),
    mapWidth: parseInt(process.env.MAP_WIDTH ?? '825'),
    mapHeight: parseInt(process.env.MAP_HEIGHT ?? '800'),

    // --------- Comarca style configuration
    comarcaAttr: {
        'fill': '#fff',
        'stroke': '#c7ab89',
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
        'fill': '#a07a49',
        'stroke': '#000000',
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
        'fill': '#FF9900',
        'font-family': 'Droid Sans, Arial, sans-serif',
        'font-size': '12px',
        'font-weight': 'bold',
        'cursor': 'pointer',
        'z-index': 30
    }
};

export default MAP_CONFIG;
